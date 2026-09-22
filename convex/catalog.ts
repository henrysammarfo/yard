import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMembership, logActivity } from "./lib/access";
import { internal } from "./_generated/api";

export const list = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId);
    return await ctx.db
      .query("suppliers")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .take(100);
  },
});

export const get = query({
  args: { orgId: v.id("organizations"), supplierId: v.id("suppliers") },
  handler: async (ctx, { orgId, supplierId }) => {
    await requireMembership(ctx, orgId);
    const s = await ctx.db.get(supplierId);
    if (!s || s.orgId !== orgId) return null;
    return s;
  },
});

export const getBySlug = query({
  args: { orgId: v.id("organizations"), slug: v.string() },
  handler: async (ctx, { orgId, slug }) => {
    await requireMembership(ctx, orgId);
    return await ctx.db
      .query("suppliers")
      .withIndex("by_org_slug", (q) => q.eq("orgId", orgId).eq("slug", slug))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    category: v.string(),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.orgId, ["owner", "staff", "buyer"]);
    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const existing = await ctx.db
      .query("suppliers")
      .withIndex("by_org_slug", (q) => q.eq("orgId", args.orgId).eq("slug", slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        category: args.category,
        website: args.website,
        email: args.email,
      });
      return existing._id;
    }
    return await ctx.db.insert("suppliers", {
      orgId: args.orgId,
      name: args.name,
      slug,
      category: args.category,
      website: args.website,
      email: args.email,
      score: 80,
      quoteCount: 0,
      winRate: "—",
      response: "—",
      spendLabel: "—",
      status: "Active",
    });
  },
});

export const listMaterials = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId);
    return await ctx.db
      .query("materials")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .take(100);
  },
});

export const upsertMaterial = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    category: v.string(),
    unit: v.string(),
    pageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.orgId, ["owner", "staff", "buyer"]);
    return await ctx.db.insert("materials", {
      orgId: args.orgId,
      name: args.name,
      category: args.category,
      unit: args.unit,
      pageUrl: args.pageUrl,
      sourceLabel: args.pageUrl ? "1 source" : "unlinked",
      changeLabel: "—",
      direction: "flat",
    });
  },
});

export const refreshMaterial = mutation({
  args: {
    orgId: v.id("organizations"),
    materialId: v.id("materials"),
  },
  handler: async (ctx, { orgId, materialId }) => {
    await requireMembership(ctx, orgId, ["owner", "staff", "buyer"]);
    const material = await ctx.db.get(materialId);
    if (!material || material.orgId !== orgId) throw new Error("Not found");
    await logActivity(ctx, {
      orgId,
      title: `Market refresh: ${material.name}`,
      detail: "Firecrawl re-check scheduled for material page price.",
      type: "crawl",
    });
    await ctx.scheduler.runAfter(0, internal.materialsAction.refresh, {
      materialId,
    });
  },
});

export const listOrders = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId, ["owner", "buyer"]);
    return await ctx.db
      .query("orders")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(100);
  },
});

export const getOrder = query({
  args: { orgId: v.id("organizations"), orderId: v.id("orders") },
  handler: async (ctx, { orgId, orderId }) => {
    await requireMembership(ctx, orgId, ["owner", "buyer"]);
    const order = await ctx.db.get(orderId);
    if (!order || order.orgId !== orgId) return null;
    return order;
  },
});

export const createOrderFromQuote = mutation({
  args: {
    orgId: v.id("organizations"),
    quoteId: v.id("quotes"),
  },
  handler: async (ctx, { orgId, quoteId }) => {
    await requireMembership(ctx, orgId, ["owner", "buyer"]);
    const quote = await ctx.db.get(quoteId);
    if (!quote || quote.orgId !== orgId) throw new Error("Quote not found");
    const total =
      quote.quotedUnitPrice *
      (quote.quantityNumber && quote.quantityNumber > 0 ? quote.quantityNumber : 1);
    const publicId = `PO-${Date.now().toString().slice(-6)}`;
    const orderId = await ctx.db.insert("orders", {
      orgId,
      publicId,
      supplierName: quote.supplierName,
      itemLabel: `${quote.quantity} · ${quote.material}`,
      totalLabel: total.toFixed(2),
      totalAmount: total,
      status: "Confirmed",
      quoteId,
      createdAt: Date.now(),
    });
    await ctx.db.patch(quoteId, { status: "approved" });
    await logActivity(ctx, {
      orgId,
      title: `${publicId} created`,
      detail: `Order from ${quote.publicId}.`,
      type: "approve",
      quoteId,
    });
    return orderId;
  },
});

export const setOrderStatus = mutation({
  args: {
    orgId: v.id("organizations"),
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, { orgId, orderId, status }) => {
    await requireMembership(ctx, orgId, ["owner", "buyer"]);
    const order = await ctx.db.get(orderId);
    if (!order || order.orgId !== orgId) throw new Error("Order not found");
    await ctx.db.patch(orderId, { status });
  },
});

export const listActivity = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId, ["owner", "buyer", "staff"]);
    return await ctx.db
      .query("activity")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(100);
  },
});

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email.includes("@")) throw new Error("Valid email required");
    if (!args.message.trim()) throw new Error("Message required");
    return await ctx.db.insert("contactMessages", {
      name: args.name.trim(),
      email,
      message: args.message.trim(),
      createdAt: Date.now(),
    });
  },
});

export const submitSupplierQuote = mutation({
  args: {
    orgId: v.id("organizations"),
    material: v.string(),
    specification: v.string(),
    quantity: v.string(),
    quotedUnitPrice: v.number(),
    pageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { membership } = await requireMembership(ctx, args.orgId, ["supplier", "owner"]);
    if (!(args.quotedUnitPrice > 0)) throw new Error("Price must be > 0");
    const qtyMatch = args.quantity.match(/(\d+(?:\.\d+)?)/);
    const quantityNumber = qtyMatch ? Number(qtyMatch[1]) : 1;
    const publicId = `QT-${Date.now().toString().slice(-6)}`;
    const quoteId = await ctx.db.insert("quotes", {
      orgId: args.orgId,
      publicId,
      supplierName: membership.name,
      supplierInitials: membership.name.slice(0, 2).toUpperCase(),
      material: args.material,
      specification: args.specification,
      quantity: args.quantity,
      quantityNumber,
      quotedUnitPrice: args.quotedUnitPrice,
      pageUrl: args.pageUrl,
      status: "pending",
      confidence: 80,
      receivedAt: Date.now(),
    });
    await logActivity(ctx, {
      orgId: args.orgId,
      title: `${publicId} from supplier portal`,
      detail: "Supplier submitted a quote; Firecrawl check scheduled.",
      type: "mail",
      quoteId,
    });
    await ctx.scheduler.runAfter(0, internal.crawl.checkQuote, { quoteId });
    return quoteId;
  },
});
