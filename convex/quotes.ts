import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireMembership, logActivity } from "./lib/access";
import { Id } from "./_generated/dataModel";

export const getInternal = internalQuery({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, { quoteId }) => ctx.db.get(quoteId),
});

export const setStatusInternal = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    status: v.union(
      v.literal("pending"),
      v.literal("checking"),
      v.literal("amber"),
      v.literal("matched"),
      v.literal("countered"),
      v.literal("counter_failed"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("needs_info"),
    ),
  },
  handler: async (ctx, { quoteId, status }) => {
    await ctx.db.patch(quoteId, { status });
  },
});

export const markAmber = internalMutation({
  args: { quoteId: v.id("quotes"), extractError: v.string() },
  handler: async (ctx, { quoteId, extractError }) => {
    const quote = await ctx.db.get(quoteId);
    if (!quote) return;
    await ctx.db.patch(quoteId, {
      status: "amber",
      extractError,
      checkedAt: Date.now(),
    });
    await logActivity(ctx, {
      orgId: quote.orgId,
      title: `${quote.publicId} stayed amber`,
      detail: `${extractError} — no outbound mail.`,
      type: "crawl",
      quoteId,
    });
  },
});

export const markMatched = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    pageUnitPrice: v.number(),
    pageUrl: v.string(),
  },
  handler: async (ctx, { quoteId, pageUnitPrice, pageUrl }) => {
    const quote = await ctx.db.get(quoteId);
    if (!quote) return;
    await ctx.db.patch(quoteId, {
      status: "matched",
      pageUnitPrice,
      pageUrl,
      checkedAt: Date.now(),
      confidence: 99,
    });
    await logActivity(ctx, {
      orgId: quote.orgId,
      title: `${quote.publicId} matched public page`,
      detail: `Quoted ${quote.quotedUnitPrice} ≤ page ${pageUnitPrice}. No reply sent.`,
      type: "crawl",
      quoteId,
    });
  },
});

export const setPagePrice = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    pageUnitPrice: v.number(),
    pageUrl: v.string(),
  },
  handler: async (ctx, { quoteId, pageUnitPrice, pageUrl }) => {
    await ctx.db.patch(quoteId, { pageUnitPrice, pageUrl, confidence: 97 });
  },
});

export const markCounterFailed = internalMutation({
  args: { quoteId: v.id("quotes"), draftError: v.string() },
  handler: async (ctx, { quoteId, draftError }) => {
    const quote = await ctx.db.get(quoteId);
    if (!quote) return;
    await ctx.db.patch(quoteId, {
      status: "counter_failed",
      draftError,
      checkedAt: Date.now(),
    });
    await logActivity(ctx, {
      orgId: quote.orgId,
      title: `${quote.publicId} counter failed`,
      detail: `${draftError} — no outbound mail.`,
      type: "system",
      quoteId,
    });
  },
});

export const listByOrg = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId);
    return await ctx.db
      .query("quotes")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(100);
  },
});

export const listByStatus = query({
  args: {
    orgId: v.id("organizations"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("checking"),
        v.literal("amber"),
        v.literal("matched"),
        v.literal("countered"),
        v.literal("counter_failed"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("needs_info"),
      ),
    ),
  },
  handler: async (ctx, { orgId, status }) => {
    await requireMembership(ctx, orgId);
    if (status) {
      return await ctx.db
        .query("quotes")
        .withIndex("by_org_status", (q) => q.eq("orgId", orgId).eq("status", status))
        .order("desc")
        .take(100);
    }
    return await ctx.db
      .query("quotes")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(100);
  },
});

export const get = query({
  args: { orgId: v.id("organizations"), quoteId: v.id("quotes") },
  handler: async (ctx, { orgId, quoteId }) => {
    await requireMembership(ctx, orgId);
    const quote = await ctx.db.get(quoteId);
    if (!quote || quote.orgId !== orgId) return null;
    return quote;
  },
});

export const getByPublicId = query({
  args: { orgId: v.id("organizations"), publicId: v.string() },
  handler: async (ctx, { orgId, publicId }) => {
    await requireMembership(ctx, orgId);
    return await ctx.db
      .query("quotes")
      .withIndex("by_org_public", (q) => q.eq("orgId", orgId).eq("publicId", publicId))
      .unique();
  },
});

export const setStatus = mutation({
  args: {
    orgId: v.id("organizations"),
    quoteId: v.id("quotes"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("needs_info"),
      v.literal("pending"),
    ),
  },
  handler: async (ctx, { orgId, quoteId, status }) => {
    await requireMembership(ctx, orgId, ["owner", "buyer"]);
    const quote = await ctx.db.get(quoteId);
    if (!quote || quote.orgId !== orgId) throw new Error("Quote not found");
    await ctx.db.patch(quoteId, { status });
    await logActivity(ctx, {
      orgId,
      title: `${quote.publicId} → ${status}`,
      detail: "Status updated by workspace user.",
      type: "approve",
      quoteId,
    });
  },
});

export const assign = mutation({
  args: {
    orgId: v.id("organizations"),
    quoteId: v.id("quotes"),
    assignee: v.string(),
  },
  handler: async (ctx, { orgId, quoteId, assignee }) => {
    await requireMembership(ctx, orgId, ["owner", "staff", "buyer"]);
    const quote = await ctx.db.get(quoteId);
    if (!quote || quote.orgId !== orgId) throw new Error("Quote not found");
    await ctx.db.patch(quoteId, { assignee });
    await logActivity(ctx, {
      orgId,
      title: `${quote.publicId} assigned`,
      detail: `Assigned to ${assignee}.`,
      type: "assign",
      quoteId,
    });
  },
});

export const createManual = mutation({
  args: {
    orgId: v.id("organizations"),
    supplierName: v.string(),
    material: v.string(),
    specification: v.string(),
    quantity: v.string(),
    quotedUnitPrice: v.number(),
    pageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.orgId, ["owner", "staff", "buyer"]);
    if (!(args.quotedUnitPrice > 0)) throw new Error("quotedUnitPrice must be > 0");
    const publicId = `QT-${Date.now().toString().slice(-6)}`;
    const quoteId: Id<"quotes"> = await ctx.db.insert("quotes", {
      orgId: args.orgId,
      publicId,
      supplierName: args.supplierName,
      supplierInitials: args.supplierName.slice(0, 2).toUpperCase(),
      material: args.material,
      specification: args.specification,
      quantity: args.quantity,
      quotedUnitPrice: args.quotedUnitPrice,
      pageUrl: args.pageUrl,
      status: "pending",
      confidence: 85,
      receivedAt: Date.now(),
    });
    await logActivity(ctx, {
      orgId: args.orgId,
      title: `${publicId} created`,
      detail: "Manual quote intake.",
      type: "mail",
      quoteId,
    });
    await ctx.scheduler.runAfter(0, internal.crawl.checkQuote, { quoteId });
    return quoteId;
  },
});
