import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type Role = "owner" | "staff" | "buyer" | "supplier";

export type Session = {
  role: Role;
  name: string;
  initials: string;
  org: string;
  orgId: Id<"organizations">;
  userId: Id<"users">;
};

export const roleProfiles: Record<
  Role,
  { label: string; copy: string; home: "/dashboard" | "/board" | "/inbox" | "/supplier-portal" }
> = {
  owner: {
    label: "Owner",
    copy: "Full oversight, approvals, spend and team control",
    home: "/dashboard",
  },
  buyer: {
    label: "Buyer",
    copy: "Quotes, market evidence, approvals and orders",
    home: "/board",
  },
  staff: {
    label: "Staff",
    copy: "Inbox intake, quote prep and supplier follow-up",
    home: "/inbox",
  },
  supplier: {
    label: "Supplier",
    copy: "Open requests, quote submission and history",
    home: "/supplier-portal",
  },
};

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
  const key = Object.keys(access)
    .filter((k) => path === k || path.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return key ? access[key]! : (["owner", "staff", "buyer", "supplier"] as Role[]);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

/** Live session from Convex Auth + primary membership. No localStorage. */
export function useSession(): Session | null | undefined {
  const workspace = useQuery(api.organizations.myWorkspace);
  if (workspace === undefined) return undefined;
  if (!workspace?.user || !workspace.membership || !workspace.org) return null;
  const name = workspace.membership.name || workspace.user.name || workspace.user.email || "Member";
  return {
    role: workspace.membership.role,
    name,
    initials: initials(name),
    org: workspace.org.name,
    orgId: workspace.org._id,
    userId: workspace.user._id,
  };
}

export function useSessionReady(): boolean {
  const workspace = useQuery(api.organizations.myWorkspace);
  return workspace !== undefined;
}

export function useOrgId(): Id<"organizations"> | null {
  const session = useSession();
  return session?.orgId ?? null;
}

export type UiQuote = {
  id: string;
  quoteId: Id<"quotes">;
  supplier: string;
  initials: string;
  material: string;
  specification: string;
  quantity: string;
  quoted: number;
  market: number;
  received: string;
  fresh: string;
  status: string;
  assignee: string;
  confidence: number;
  pageUrl?: string;
  counterText?: string;
  extractError?: string;
  draftError?: string;
  sourceText?: string;
};

export function mapQuote(q: Doc<"quotes">): UiQuote {
  const market = q.pageUnitPrice ?? q.quotedUnitPrice;
  return {
    id: q.publicId,
    quoteId: q._id,
    supplier: q.supplierName,
    initials: q.supplierInitials,
    material: q.material,
    specification: q.specification,
    quantity: q.quantity,
    quoted: q.quotedUnitPrice,
    market,
    received: relative(q.receivedAt),
    fresh: q.checkedAt ? relative(q.checkedAt) : "—",
    status: displayStatus(q.status),
    assignee: q.assignee ?? "Unassigned",
    confidence: q.confidence,
    pageUrl: q.pageUrl,
    counterText: q.counterText,
    extractError: q.extractError,
    draftError: q.draftError,
    sourceText: q.sourceText,
  };
}

function displayStatus(status: Doc<"quotes">["status"]): string {
  switch (status) {
    case "pending":
    case "checking":
      return "Review";
    case "amber":
    case "counter_failed":
    case "needs_info":
      return "Needs info";
    case "matched":
    case "approved":
      return "Approved";
    case "countered":
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

function relative(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs} hr ago`;
  return new Date(ms).toLocaleDateString();
}

export function toMutationStatus(
  ui: "Approved" | "Rejected" | "Needs info" | "Review",
): "approved" | "rejected" | "needs_info" | "pending" {
  if (ui === "Approved") return "approved";
  if (ui === "Rejected") return "rejected";
  if (ui === "Needs info") return "needs_info";
  return "pending";
}
