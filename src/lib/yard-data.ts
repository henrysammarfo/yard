export type QuoteStatus = "Review" | "Approved" | "Needs info" | "Rejected";

export type Quote = {
  id: string;
  supplier: string;
  initials: string;
  material: string;
  specification: string;
  quantity: string;
  quoted: number;
  market: number;
  received: string;
  fresh: string;
  status: QuoteStatus;
  assignee: string;
  confidence: number;
};

export const quotes: Quote[] = [
  { id: "QT-2048", supplier: "Aseda Steel Works", initials: "AS", material: "Iron rods", specification: "16mm high-tensile", quantity: "240 lengths", quoted: 23880, market: 22620, received: "8 min ago", fresh: "3 min ago", status: "Review", assignee: "Kojo", confidence: 98 },
  { id: "QT-2047", supplier: "Coastal Cement Ltd", initials: "CC", material: "Portland cement", specification: "Ghacem 42.5R", quantity: "600 bags", quoted: 73800, market: 75600, received: "24 min ago", fresh: "18 min ago", status: "Approved", assignee: "Ama", confidence: 96 },
  { id: "QT-2046", supplier: "Northline Timber", initials: "NT", material: "Wawa boards", specification: "2 × 12 × 14 ft", quantity: "180 boards", quoted: 34200, market: 31860, received: "42 min ago", fresh: "35 min ago", status: "Needs info", assignee: "Esi", confidence: 84 },
  { id: "QT-2045", supplier: "Kantamanto Wire", initials: "KW", material: "Binding wire", specification: "1.6mm annealed", quantity: "75 rolls", quoted: 8250, market: 8625, received: "1 hr ago", fresh: "54 min ago", status: "Review", assignee: "Kojo", confidence: 99 },
  { id: "QT-2044", supplier: "Volta Aggregates", initials: "VA", material: "Chippings", specification: "¾ inch granite", quantity: "30 m³", quoted: 18900, market: 17700, received: "2 hrs ago", fresh: "1 hr ago", status: "Rejected", assignee: "Ama", confidence: 92 },
  { id: "QT-2043", supplier: "Tema Roofing Co.", initials: "TR", material: "Roofing sheets", specification: "0.45mm alu-zinc", quantity: "120 sheets", quoted: 28800, market: 29400, received: "3 hrs ago", fresh: "2 hrs ago", status: "Approved", assignee: "Esi", confidence: 97 },
];

export const suppliers = [
  { id: "aseda-steel", name: "Aseda Steel Works", category: "Steel", score: 92, quotes: 38, winRate: "71%", response: "18m", spend: "GH₵ 184k", status: "Preferred" },
  { id: "coastal-cement", name: "Coastal Cement Ltd", category: "Cement", score: 96, quotes: 51, winRate: "78%", response: "12m", spend: "GH₵ 263k", status: "Preferred" },
  { id: "northline-timber", name: "Northline Timber", category: "Timber", score: 81, quotes: 26, winRate: "54%", response: "44m", spend: "GH₵ 96k", status: "Active" },
  { id: "kantamanto-wire", name: "Kantamanto Wire", category: "Hardware", score: 89, quotes: 42, winRate: "64%", response: "23m", spend: "GH₵ 112k", status: "Active" },
  { id: "volta-aggregates", name: "Volta Aggregates", category: "Aggregates", score: 74, quotes: 19, winRate: "42%", response: "1h 12m", spend: "GH₵ 78k", status: "Watch" },
];

export const materials = [
  { name: "16mm iron rods", category: "Steel", price: "GH₵ 94.25", unit: "per length", change: "−2.4%", direction: "down", source: "3 sources", freshness: "3m" },
  { name: "Ghacem 42.5R", category: "Cement", price: "GH₵ 126.00", unit: "per bag", change: "+1.2%", direction: "up", source: "5 sources", freshness: "18m" },
  { name: "Wawa 2×12", category: "Timber", price: "GH₵ 177.00", unit: "per board", change: "+3.8%", direction: "up", source: "2 sources", freshness: "35m" },
  { name: "Binding wire", category: "Hardware", price: "GH₵ 115.00", unit: "per roll", change: "−1.5%", direction: "down", source: "4 sources", freshness: "54m" },
  { name: "¾ inch chippings", category: "Aggregates", price: "GH₵ 590.00", unit: "per m³", change: "+0.6%", direction: "up", source: "3 sources", freshness: "1h" },
];

export const orders = [
  { id: "PO-1042", supplier: "Coastal Cement Ltd", item: "600 bags · Ghacem 42.5R", total: "GH₵ 73,800", date: "15 Sep", status: "Confirmed" },
  { id: "PO-1041", supplier: "Tema Roofing Co.", item: "120 sheets · 0.45mm alu-zinc", total: "GH₵ 28,800", date: "15 Sep", status: "Awaiting delivery" },
  { id: "PO-1040", supplier: "Aseda Steel Works", item: "180 lengths · 12mm rods", total: "GH₵ 13,860", date: "14 Sep", status: "Delivered" },
  { id: "PO-1039", supplier: "Kantamanto Wire", item: "40 rolls · Binding wire", total: "GH₵ 4,480", date: "13 Sep", status: "Delivered" },
];

export const activity = [
  { time: "09:42", title: "Quote QT-2048 entered review", detail: "AgentMail received and parsed Aseda Steel Works’ quote.", type: "mail" },
  { time: "09:39", title: "Market price refreshed", detail: "Firecrawl checked three public sources for 16mm iron rods.", type: "crawl" },
  { time: "09:26", title: "Purchase PO-1042 approved", detail: "Ama approved Coastal Cement’s quote and confirmation was queued.", type: "approve" },
  { time: "09:25", title: "Confirmation delivered", detail: "AgentMail sent the approved purchase terms to Coastal Cement Ltd.", type: "send" },
  { time: "09:08", title: "Quote assigned to Esi", detail: "Northline Timber needs a delivery date before approval.", type: "assign" },
];
