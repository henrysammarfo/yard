"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { FirecrawlClient } from "@firecrawl/firecrawl-convex";

const firecrawl = new FirecrawlClient(components.firecrawl);

export const refresh = internalAction({
  args: { materialId: v.id("materials") },
  handler: async (ctx, { materialId }) => {
    const material = await ctx.runQuery(internal.materials.getInternal, {
      materialId,
    });
    if (!material?.pageUrl) {
      await ctx.runMutation(internal.materials.markRefreshFailed, {
        materialId,
        reason: "No pageUrl on material",
      });
      return;
    }
    try {
      const scraped = await firecrawl.scrape(ctx, material.pageUrl, {
        formats: [
          {
            type: "json",
            prompt: "Extract the unit price",
            schema: {
              type: "object",
              properties: { unit_price: { type: "number" } },
              required: ["unit_price"],
            },
          },
        ],
        onlyMainContent: true,
      });
      const json = (scraped as { json?: { unit_price?: number } }).json;
      const price = json?.unit_price;
      if (typeof price !== "number" || !(price > 0)) {
        await ctx.runMutation(internal.materials.markRefreshFailed, {
          materialId,
          reason: "No unit_price extracted",
        });
        return;
      }
      await ctx.runMutation(internal.materials.applyPagePrice, {
        materialId,
        pageUnitPrice: price,
        pageUrl: material.pageUrl,
      });
    } catch (err) {
      await ctx.runMutation(internal.materials.markRefreshFailed, {
        materialId,
        reason: err instanceof Error ? err.message : "scrape failed",
      });
    }
  },
});
