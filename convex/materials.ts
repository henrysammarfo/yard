import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { requireMembership, logActivity } from "./lib/access";

export const getInternal = internalQuery({
  args: { materialId: v.id("materials") },
  handler: async (ctx, { materialId }) => ctx.db.get(materialId),
});

export const applyPagePrice = internalMutation({
  args: {
    materialId: v.id("materials"),
    pageUnitPrice: v.number(),
    pageUrl: v.string(),
  },
  handler: async (ctx, { materialId, pageUnitPrice, pageUrl }) => {
    const material = await ctx.db.get(materialId);
    if (!material) return;
    const prev = material.pagePrice;
    let direction: "up" | "down" | "flat" = "flat";
    let changeLabel = "—";
    if (typeof prev === "number" && prev > 0) {
      const pct = ((pageUnitPrice - prev) / prev) * 100;
      direction = pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat";
      changeLabel = `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    }
    await ctx.db.patch(materialId, {
      pagePrice: pageUnitPrice,
      pageUrl,
      freshnessMs: Date.now(),
      sourceLabel: "Firecrawl",
      changeLabel,
      direction,
    });
    await logActivity(ctx, {
      orgId: material.orgId,
      title: `Market price updated: ${material.name}`,
      detail: `Page unit price ${pageUnitPrice} from public URL.`,
      type: "crawl",
    });
  },
});

export const markRefreshFailed = internalMutation({
  args: { materialId: v.id("materials"), reason: v.string() },
  handler: async (ctx, { materialId, reason }) => {
    const material = await ctx.db.get(materialId);
    if (!material) return;
    const friendly =
      /no unit_price|not extracted|extract/i.test(reason)
        ? "Could not read a clear unit price from that page. Check the URL shows a price, then tap Re-check."
        : /no pageurl/i.test(reason)
          ? "Add a public page URL on this material, then tap Re-check."
          : reason;
    await logActivity(ctx, {
      orgId: material.orgId,
      title: `Market refresh failed: ${material.name}`,
      detail: friendly,
      type: "crawl",
    });
  },
});

export const integrationHealth = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requireMembership(ctx, orgId, ["owner"]);
    const org = await ctx.db.get(orgId);
    return {
      agentmail: {
        configured: Boolean(process.env.AGENTMAIL_API_KEY),
        inboxId: org?.inboxId ?? null,
        webhookPath: "/agentmail/webhook",
      },
      firecrawl: {
        configured: Boolean(process.env.FIRECRAWL_API_KEY),
      },
      llm: {
        agentRouter: Boolean(process.env.AGENTROUTER_API_KEY),
        venice: Boolean(process.env.VENICE_API_KEY),
        note: "AI Gateway requires a paid Convex team; checked at draft time",
      },
    };
  },
});
