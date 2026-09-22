import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const role = v.union(
  v.literal("owner"),
  v.literal("staff"),
  v.literal("buyer"),
  v.literal("supplier"),
);

const quoteStatus = v.union(
  v.literal("pending"),
  v.literal("checking"),
  v.literal("amber"),
  v.literal("matched"),
  v.literal("countered"),
  v.literal("counter_failed"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("needs_info"),
);

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    inboxId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  memberships: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role,
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"])
    .index("by_org_user", ["orgId", "userId"]),

  suppliers: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    category: v.string(),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    score: v.number(),
    quoteCount: v.number(),
    winRate: v.string(),
    response: v.string(),
    spendLabel: v.string(),
    status: v.string(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_slug", ["orgId", "slug"]),

  materials: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    category: v.string(),
    unit: v.string(),
    pagePrice: v.optional(v.number()),
    pageUrl: v.optional(v.string()),
    freshnessMs: v.optional(v.number()),
    sourceLabel: v.string(),
    changeLabel: v.string(),
    direction: v.union(v.literal("up"), v.literal("down"), v.literal("flat")),
  }).index("by_org", ["orgId"]),

  quotes: defineTable({
    orgId: v.id("organizations"),
    publicId: v.string(),
    supplierId: v.optional(v.id("suppliers")),
    supplierName: v.string(),
    supplierInitials: v.string(),
    material: v.string(),
    specification: v.string(),
    quantity: v.string(),
    quantityNumber: v.optional(v.number()),
    quotedUnitPrice: v.number(),
    pageUnitPrice: v.optional(v.number()),
    pageUrl: v.optional(v.string()),
    status: quoteStatus,
    assignee: v.optional(v.string()),
    confidence: v.number(),
    agentmailInboxId: v.optional(v.string()),
    agentmailMessageId: v.optional(v.string()),
    agentmailThreadId: v.optional(v.string()),
    sourceSubject: v.optional(v.string()),
    sourceText: v.optional(v.string()),
    counterText: v.optional(v.string()),
    extractError: v.optional(v.string()),
    draftError: v.optional(v.string()),
    receivedAt: v.number(),
    checkedAt: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .index("by_org_status", ["orgId", "status"])
    .index("by_org_public", ["orgId", "publicId"])
    .index("by_message", ["agentmailMessageId"]),

  orders: defineTable({
    orgId: v.id("organizations"),
    publicId: v.string(),
    supplierName: v.string(),
    itemLabel: v.string(),
    totalLabel: v.string(),
    totalAmount: v.number(),
    status: v.string(),
    quoteId: v.optional(v.id("quotes")),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_public", ["orgId", "publicId"]),

  activity: defineTable({
    orgId: v.id("organizations"),
    title: v.string(),
    detail: v.string(),
    type: v.union(
      v.literal("mail"),
      v.literal("crawl"),
      v.literal("approve"),
      v.literal("send"),
      v.literal("assign"),
      v.literal("system"),
    ),
    quoteId: v.optional(v.id("quotes")),
    createdAt: v.number(),
  }).index("by_org", ["orgId"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),

  orgSettings: defineTable({
    orgId: v.id("organizations"),
    notifyEmail: v.optional(v.string()),
    defaultAssignee: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_org", ["orgId"]),
});
