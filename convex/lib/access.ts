import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

export type Role = "owner" | "staff" | "buyer" | "supplier";

type Ctx = QueryCtx | MutationCtx;

export async function requireUserId(ctx: Ctx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

export async function getMembership(
  ctx: Ctx,
  orgId: Id<"organizations">,
  userId: Id<"users">,
): Promise<Doc<"memberships"> | null> {
  return await ctx.db
    .query("memberships")
    .withIndex("by_org_user", (q) => q.eq("orgId", orgId).eq("userId", userId))
    .unique();
}

export async function requireMembership(
  ctx: Ctx,
  orgId: Id<"organizations">,
  roles?: Role[],
): Promise<{ userId: Id<"users">; membership: Doc<"memberships"> }> {
  const userId = await requireUserId(ctx);
  const membership = await getMembership(ctx, orgId, userId);
  if (!membership) {
    throw new Error("Not a member of this organization");
  }
  if (roles && !roles.includes(membership.role)) {
    throw new Error("Insufficient role for this action");
  }
  return { userId, membership };
}

export async function primaryMembership(
  ctx: Ctx,
  userId: Id<"users">,
): Promise<Doc<"memberships"> | null> {
  return await ctx.db
    .query("memberships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

export async function logActivity(
  ctx: MutationCtx,
  args: {
    orgId: Id<"organizations">;
    title: string;
    detail: string;
    type: Doc<"activity">["type"];
    quoteId?: Id<"quotes">;
  },
) {
  await ctx.db.insert("activity", {
    orgId: args.orgId,
    title: args.title,
    detail: args.detail,
    type: args.type,
    quoteId: args.quoteId,
    createdAt: Date.now(),
  });
}

export function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function parseQuoteFromEmail(
  text: string,
  subject?: string,
): {
  material: string;
  specification: string;
  quantity: string;
  quantityNumber?: number;
  quotedUnitPrice: number;
  pageUrl?: string;
  supplierName: string;
} {
  const blob = `${subject ?? ""}\n${text}`;
  const urlMatch = blob.match(/https?:\/\/[^\s<>"]+/i);

  // Prefer explicit currency / "per unit" prices; never treat "50kg" as a unit price.
  const pricePatterns = [
    /(?:\$|USD\s*|EUR\s*|€|£)\s*(\d+(?:\.\d{1,4})?)/i,
    /(\d+(?:\.\d{1,4})?)\s*(?:\/|\s+per\s+)(?:bag|unit|each|ea|ton|m3|m³|copy|copies|length|sheet|roll)\b/i,
    /(?:unit\s*price|quoted(?:\s*at)?|price)\s*[:=]?\s*(?:\$|USD\s*)?(\d+(?:\.\d{1,4})?)/i,
  ];
  let quotedUnitPrice: number | null = null;
  for (const re of pricePatterns) {
    const m = blob.match(re);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > 0) {
      quotedUnitPrice = n;
      break;
    }
  }
  if (quotedUnitPrice == null) {
    throw new Error("Could not parse a unit price from the email");
  }

  const qtyMatch = blob.match(
    /(\d+(?:\.\d+)?)\s*(bags?|units?|lengths?|sheets?|rolls?|m3|m³|tons?|copies|copy)\b/i,
  );
  const materialLine =
    subject?.replace(/^(re:|fwd:)\s*/i, "").trim() ||
    text
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 3 && !/^https?:/i.test(l)) ||
    "Quoted material";

  return {
    material: materialLine.slice(0, 120),
    specification: materialLine.slice(0, 160),
    quantity: qtyMatch ? `${qtyMatch[1]} ${qtyMatch[2]}` : "1 unit",
    quantityNumber: qtyMatch ? Number(qtyMatch[1]) : 1,
    quotedUnitPrice,
    pageUrl: urlMatch?.[0],
    supplierName: "Supplier",
  };
}
