import { useSyncExternalStore } from "react";

export type Role = "owner" | "staff" | "buyer" | "supplier";

export type Session = { role: Role; name: string; initials: string; org: string };

export const roleProfiles: Record<Role, Omit<Session, "role"> & { label: string; copy: string; home: "/dashboard" | "/board" | "/inbox" | "/supplier-portal" }> = {
  owner: { label: "Owner", copy: "Full oversight, approvals, spend and team control", name: "Henry Marfo", initials: "HM", org: "Adom Yard", home: "/dashboard" },
  buyer: { label: "Buyer", copy: "Quotes, market evidence, approvals and orders", name: "Ama Aidoo", initials: "AA", org: "Adom Yard", home: "/board" },
  staff: { label: "Staff", copy: "Inbox intake, quote prep and supplier follow-up", name: "Kojo Antwi", initials: "KA", org: "Adom Yard", home: "/inbox" },
  supplier: { label: "Supplier", copy: "Open requests, quote submission and history", name: "Kwesi Boateng", initials: "KB", org: "Aseda Steel Works", home: "/supplier-portal" },
};

/** Route access by role. Every protected path must appear here. */
export const access: Record<string, Role[]> = {
  "/dashboard": ["owner", "buyer"],
  "/inbox": ["owner", "staff", "buyer"],
  "/board": ["owner", "staff", "buyer"],
  "/approvals": ["owner", "buyer"],
  "/suppliers": ["owner", "staff", "buyer"],
  "/materials": ["owner", "staff", "buyer"],
  "/orders": ["owner", "buyer"],
  "/activity": ["owner", "buyer"],
  "/workspace-team": ["owner"],
  "/settings": ["owner"],
  "/quotes": ["owner", "staff", "buyer"],
  "/supplier-portal": ["supplier", "owner"],
};

export function allowedFor(path: string): Role[] {
  const key = Object.keys(access).filter((k) => path === k || path.startsWith(k + "/")).sort((a, b) => b.length - a.length)[0];
  return key ? access[key]! : (["owner", "staff", "buyer", "supplier"] as Role[]);
}

const KEY = "yard.session";
let current: Session | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) current = JSON.parse(raw) as Session;
  } catch { current = null; }
}

export function signIn(role: Role) {
  const p = roleProfiles[role];
  current = { role, name: p.name, initials: p.initials, org: p.org };
  hydrated = true;
  try { window.localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* storage blocked */ }
  emit();
}

export function signOut() {
  current = null;
  try { window.localStorage.removeItem(KEY); } catch { /* storage blocked */ }
  emit();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function useSession() {
  return useSyncExternalStore(subscribe, () => { hydrate(); return current; }, () => null);
}

/** True once the browser has read stored session state (false during SSR). */
export function useSessionReady() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
