import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { mapQuote, useOrgId, type UiQuote } from "./yard-session";
import type { Id } from "../../convex/_generated/dataModel";

export type YardView = {
  quotes: UiQuote[];
  orders: Array<{
    id: string;
    orderId: Id<"orders">;
    supplier: string;
    item: string;
    total: string;
    date: string;
    status: string;
  }>;
  activity: Array<{ time: string; title: string; detail: string; type: string }>;
  suppliers: Array<{
    id: string;
    supplierId: Id<"suppliers">;
    name: string;
    category: string;
    score: number;
    quotes: number;
    winRate: string;
    response: string;
    spend: string;
    status: string;
  }>;
  materials: Array<{
    materialId: Id<"materials">;
    name: string;
    category: string;
    price: string;
    unit: string;
    change: string;
    direction: string;
    source: string;
    freshness: string;
  }>;
  ready: boolean;
};

export function useYard(): YardView {
  const orgId = useOrgId();
  const quotesRaw = useQuery(api.quotes.listByOrg, orgId ? { orgId } : "skip");
  const ordersRaw = useQuery(api.catalog.listOrders, orgId ? { orgId } : "skip");
  const activityRaw = useQuery(api.catalog.listActivity, orgId ? { orgId } : "skip");
  const suppliersRaw = useQuery(api.catalog.list, orgId ? { orgId } : "skip");
  const materialsRaw = useQuery(api.catalog.listMaterials, orgId ? { orgId } : "skip");

  const ready =
    !!orgId &&
    quotesRaw !== undefined &&
    ordersRaw !== undefined &&
    activityRaw !== undefined &&
    suppliersRaw !== undefined &&
    materialsRaw !== undefined;

  return {
    ready,
    quotes: (quotesRaw ?? []).map(mapQuote),
    orders: (ordersRaw ?? []).map((o) => ({
      id: o.publicId,
      orderId: o._id,
      supplier: o.supplierName,
      item: o.itemLabel,
      total: o.totalLabel,
      date: new Date(o.createdAt).toLocaleDateString(),
      status: o.status,
    })),
    activity: (activityRaw ?? []).map((a) => ({
      time: new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title: a.title,
      detail: a.detail,
      type: a.type,
    })),
    suppliers: (suppliersRaw ?? []).map((s) => ({
      id: s.slug,
      supplierId: s._id,
      name: s.name,
      category: s.category,
      score: s.score,
      quotes: s.quoteCount,
      winRate: s.winRate,
      response: s.response,
      spend: s.spendLabel,
      status: s.status,
    })),
    materials: (materialsRaw ?? []).map((m) => ({
      materialId: m._id,
      name: m.name,
      category: m.category,
      price: m.pagePrice != null ? String(m.pagePrice) : "—",
      unit: m.unit,
      change: m.changeLabel,
      direction: m.direction,
      source: m.sourceLabel,
      freshness: m.freshnessMs
        ? `${Math.max(1, Math.round((Date.now() - m.freshnessMs) / 60000))}m`
        : "—",
    })),
  };
}

export function useQuoteActions() {
  const orgId = useOrgId();
  const setStatus = useMutation(api.quotes.setStatus);
  const assign = useMutation(api.quotes.assign);
  const createOrder = useMutation(api.catalog.createOrderFromQuote);
  const setOrderStatus = useMutation(api.catalog.setOrderStatus);
  const refreshMaterial = useMutation(api.catalog.refreshMaterial);
  const submitSupplierQuote = useMutation(api.catalog.submitSupplierQuote);

  return {
    orgId,
    async setQuoteStatus(
      quoteId: Id<"quotes">,
      status: "approved" | "rejected" | "needs_info" | "pending",
    ) {
      if (!orgId) throw new Error("No organization");
      await setStatus({ orgId, quoteId, status });
    },
    async assignQuote(quoteId: Id<"quotes">, assignee: string) {
      if (!orgId) throw new Error("No organization");
      await assign({ orgId, quoteId, assignee });
    },
    async approveToOrder(quoteId: Id<"quotes">) {
      if (!orgId) throw new Error("No organization");
      return await createOrder({ orgId, quoteId });
    },
    async updateOrderStatus(orderId: Id<"orders">, status: string) {
      if (!orgId) throw new Error("No organization");
      await setOrderStatus({ orgId, orderId, status });
    },
    async refreshMarket(materialId: Id<"materials">) {
      if (!orgId) throw new Error("No organization");
      await refreshMaterial({ orgId, materialId });
    },
    async submitSupplierQuote(input: {
      material: string;
      specification: string;
      quantity: string;
      quotedUnitPrice: number;
      pageUrl?: string;
    }) {
      if (!orgId) throw new Error("No organization");
      return await submitSupplierQuote({ orgId, ...input });
    },
  };
}
