import { useSyncExternalStore } from "react";
import { activity as seedActivity, orders as seedOrders, quotes as seedQuotes, type Quote, type QuoteStatus } from "./yard-data";

export type ActivityItem = { time: string; title: string; detail: string; type: string };
export type Order = { id: string; supplier: string; item: string; total: string; date: string; status: string };
export type State = { quotes: Quote[]; orders: Order[]; activity: ActivityItem[]; supplierQuotes: { id: string; material: string; total: string; status: string; date: string }[] };

const KEY = "yard.workspace";

function seed(): State {
  return {
    quotes: seedQuotes.map((q) => ({ ...q })),
    orders: seedOrders.map((o) => ({ ...o })),
    activity: seedActivity.map((a) => ({ ...a })),
    supplierQuotes: [
      { id: "QT-2048", material: "16mm high-tensile rods", total: "GH₵ 23,880", status: "Review", date: "21 Sep" },
      { id: "QT-2031", material: "12mm rods", total: "GH₵ 13,860", status: "Approved", date: "14 Sep" },
      { id: "QT-2019", material: "Binding wire", total: "GH₵ 4,480", status: "Rejected", date: "09 Sep" },
    ],
  };
}

let state: State = seed();
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage blocked */ }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...seed(), ...(JSON.parse(raw) as State) };
  } catch { state = seed(); }
}

function set(next: State) { state = next; persist(); listeners.forEach((l) => l()); }

function clock() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const money = (n: number) => `GH₵ ${n.toLocaleString()}`;

function log(entry: ActivityItem, s: State): State { return { ...s, activity: [entry, ...s.activity] }; }

export function setQuoteStatus(id: string, status: QuoteStatus, actor = "Henry") {
  hydrate();
  const quote = state.quotes.find((q) => q.id === id);
  if (!quote) return;
  let next: State = { ...state, quotes: state.quotes.map((q) => (q.id === id ? { ...q, status } : q)) };
  next = { ...next, supplierQuotes: next.supplierQuotes.map((s) => (s.id === id ? { ...s, status } : s)) };
  if (status === "Approved" && !next.orders.some((o) => o.item.includes(quote.material) && o.supplier === quote.supplier && o.status === "Confirmed" && o.id.startsWith("PO-2"))) {
    const po: Order = { id: `PO-2${String(next.orders.length + 1).padStart(3, "0")}`, supplier: quote.supplier, item: `${quote.quantity} · ${quote.specification}`, total: money(quote.quoted), date: "21 Sep", status: "Confirmed" };
    next = { ...next, orders: [po, ...next.orders] };
    next = log({ time: clock(), title: `Purchase ${po.id} created`, detail: `${actor} approved ${quote.id} and a confirmation was queued to ${quote.supplier}.`, type: "approve" }, next);
  } else {
    next = log({ time: clock(), title: `Quote ${quote.id} marked ${status.toLowerCase()}`, detail: `${actor} updated ${quote.supplier}’s quote for ${quote.material}.`, type: status === "Rejected" ? "reject" : "assign" }, next);
  }
  set(next);
}

export function assignQuote(id: string, assignee: string) {
  hydrate();
  const quote = state.quotes.find((q) => q.id === id);
  if (!quote) return;
  set(log({ time: clock(), title: `Quote ${id} assigned to ${assignee}`, detail: `${quote.material} from ${quote.supplier} is now owned by ${assignee}.`, type: "assign" }, { ...state, quotes: state.quotes.map((q) => (q.id === id ? { ...q, assignee } : q)) }));
}

export function setOrderStatus(id: string, status: string) {
  hydrate();
  set(log({ time: clock(), title: `${id} marked ${status.toLowerCase()}`, detail: `Purchase order status updated from the workspace.`, type: "order" }, { ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
}

export function submitSupplierQuote(material: string, total: string) {
  hydrate();
  const id = `QT-21${String(state.supplierQuotes.length + 1).padStart(2, "0")}`;
  set(log({ time: clock(), title: `New quote ${id} received`, detail: `Aseda Steel Works submitted ${material} at ${total}.`, type: "mail" }, { ...state, supplierQuotes: [{ id, material, total, status: "Review", date: "21 Sep" }, ...state.supplierQuotes] }));
}

export function refreshMarket(material: string) {
  hydrate();
  set(log({ time: clock(), title: "Market price refreshed", detail: `A public price check ran for ${material} (simulated in demo mode).`, type: "crawl" }, state));
}

export function resetWorkspace() { set(seed()); }

function subscribe(cb: () => void) { hydrate(); listeners.add(cb); return () => { listeners.delete(cb); }; }
const server = seed();

export function useYard() {
  return useSyncExternalStore(subscribe, () => { hydrate(); return state; }, () => server);
}
