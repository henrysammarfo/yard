import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { primaryMembership, requireMembership, requireUserId } from "./lib/access";

export const bootstrap = mutation({
  args: {
    orgName: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("staff"),
      v.literal("buyer"),
      v.literal("supplier"),
    ),
  },
  handler: async (ctx, { orgName, role }) => {
    const userId = await requireUserId(ctx);
    const existing = await primaryMembership(ctx, userId);
    if (existing) {
      return {
        orgId: existing.orgId,
        membershipId: existing._id,
        role: existing.role,
      };
    }
    const user = await ctx.db.get(userId);
    const displayName =
      (user && "name" in user ? user.name : undefined) ??
      (user && "email" in user ? user.email : undefined) ??
      "Member";
    const slug =
      orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "yard";
    const orgId = await ctx.db.insert("organizations", {
      name: orgName,
      slug: `${slug}-${Date.now().toString(36)}`,
      createdAt: Date.now(),
    });
    const membershipId = await ctx.db.insert("memberships", {
      orgId,
      userId,
      role,
      name: displayName,
      createdAt: Date.now(),
    });
    await ctx.db.insert("orgSettings", {
      orgId,
      updatedAt: Date.now(),
    });
    return { orgId, membershipId, role };
  },
});

export const myWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const membership = await primaryMembership(ctx, userId);
    if (!membership) {
      return { user, membership: null, org: null };
    }
    const org = await ctx.db.get(membership.orgId);
    return { user, membership, org };
  },
});

export const listMembers = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId, ["owner"]);
    return await ctx.db
      .query("memberships")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .take(100);
  },
});

export const inviteMember = mutation({
  args: {
    orgId: v.id("organizations"),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("staff"),
      v.literal("buyer"),
      v.literal("supplier"),
    ),
  },
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.orgId, ["owner"]);
    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (!user) {
      throw new Error("User must sign up before they can be invited");
    }
    const existing = await ctx.db
      .query("memberships")
      .withIndex("by_org_user", (q) => q.eq("orgId", args.orgId).eq("userId", user._id))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("memberships", {
      orgId: args.orgId,
      userId: user._id,
      role: args.role,
      name: args.name,
      createdAt: Date.now(),
    });
  },
});

export const setInboxId = mutation({
  args: {
    orgId: v.id("organizations"),
    inboxId: v.string(),
  },
  handler: async (ctx, { orgId, inboxId }) => {
    await requireMembership(ctx, orgId, ["owner"]);
    await ctx.db.patch(orgId, { inboxId: inboxId.trim() });
  },
});

export const updateSettings = mutation({
  args: {
    orgId: v.id("organizations"),
    notifyEmail: v.optional(v.string()),
    defaultAssignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMembership(ctx, args.orgId, ["owner"]);
    const notifyEmail = args.notifyEmail?.trim() || undefined;
    const defaultAssignee = args.defaultAssignee?.trim() || undefined;
    const existing = await ctx.db
      .query("orgSettings")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        notifyEmail: notifyEmail ?? "",
        defaultAssignee: defaultAssignee ?? "",
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("orgSettings", {
      orgId: args.orgId,
      notifyEmail: notifyEmail ?? "",
      defaultAssignee: defaultAssignee ?? "",
      updatedAt: Date.now(),
    });
  },
});

export const getSettings = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId, ["owner"]);
    const settings = await ctx.db
      .query("orgSettings")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .unique();
    const org = await ctx.db.get(orgId);
    return {
      notifyEmail: settings?.notifyEmail ?? "",
      defaultAssignee: settings?.defaultAssignee ?? "",
      inboxId: org?.inboxId ?? "",
      orgName: org?.name ?? "",
    };
  },
});
