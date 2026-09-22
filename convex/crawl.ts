"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { FirecrawlClient } from "@firecrawl/firecrawl-convex";
import OpenAI from "openai";

const firecrawl = new FirecrawlClient(components.firecrawl);

type ExtractJson = {
  unit_price?: number;
  currency?: string;
  product_name?: string;
};

function readUnitPrice(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const candidates = [obj.unit_price, obj.unitPrice, obj.price];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c) && c > 0) return c;
    if (typeof c === "string") {
      const n = Number(c.replace(/[^0-9.]/g, ""));
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return null;
}

async function draftCounterEmail(args: {
  material: string;
  quotedUnitPrice: number;
  pageUnitPrice: number;
  pageUrl: string;
  supplierName: string;
}): Promise<string> {
  const system =
    "You write short supplier counter-emails for construction buyers. " +
    "You MUST use only the numeric prices provided. Never invent or change a price. " +
    "Ask the supplier to match the public page unit price. Plain text only.";
  const user =
    `Supplier: ${args.supplierName}\n` +
    `Material: ${args.material}\n` +
    `Quoted unit price: ${args.quotedUnitPrice}\n` +
    `Public page unit price: ${args.pageUnitPrice}\n` +
    `Page URL: ${args.pageUrl}\n` +
    `Write a brief professional reply asking them to match ${args.pageUnitPrice}.`;

  const template = () =>
    enforcePrices(
      `Hello,\n\nYour quote lists ${args.quotedUnitPrice} per unit for ${args.material}, but your public page lists ${args.pageUnitPrice}. ` +
        `Please match ${args.pageUnitPrice}.\n\nPage: ${args.pageUrl}\n\nThank you,\nYARD`,
      args.quotedUnitPrice,
      args.pageUnitPrice,
    );

  const tryProvider = async (
    label: string,
    baseURL: string,
    apiKey: string,
    model: string,
  ): Promise<string | null> => {
    try {
      const openai = new OpenAI({ baseURL, apiKey });
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      });
      const text = completion?.choices?.[0]?.message?.content?.trim();
      if (!text) {
        console.warn(`[draftCounterEmail] ${label} returned empty choices`);
        return null;
      }
      return enforcePrices(text, args.quotedUnitPrice, args.pageUnitPrice);
    } catch (err) {
      console.warn(
        `[draftCounterEmail] ${label} failed:`,
        err instanceof Error ? err.message : err,
      );
      return null;
    }
  };

  const gatewayToken = await tryGatewayToken();
  if (gatewayToken) {
    const text = await tryProvider(
      "ai-gateway",
      "https://ai-gateway.convex.dev/v1",
      gatewayToken,
      "openai/gpt-4o-mini",
    );
    if (text) return text;
  }

  const agentRouterKey = process.env.AGENTROUTER_API_KEY;
  if (agentRouterKey) {
    const text = await tryProvider(
      "agentrouter",
      "https://agentrouter.org/v1",
      agentRouterKey,
      "gpt-4o-mini",
    );
    if (text) return text;
  }

  const veniceKey = process.env.VENICE_API_KEY;
  if (veniceKey) {
    const text = await tryProvider(
      "venice",
      "https://api.venice.ai/api/v1",
      veniceKey,
      "llama-3.3-70b",
    );
    if (text) return text;
  }

  // Deterministic numbers-only fallback so counters still send when LLM egress is blocked.
  return template();
}

async function tryGatewayToken(): Promise<string | null> {
  try {
    const mod = (await import("convex/server")) as Record<string, unknown>;
    const fn = mod.getServiceToken;
    if (typeof fn !== "function") return null;
    return (await (fn as (s: string) => Promise<string>)("ai-gateway")) as string;
  } catch {
    return null;
  }
}

function enforcePrices(text: string, quoted: number, page: number): string {
  // Ensure the page price appears; never allow a different invented figure as the ask.
  if (!text.includes(String(page))) {
    return (
      `Hello,\n\nYour quote lists ${quoted} per unit for this item, but your public page lists ${page}. ` +
      `Please match ${page}.\n\nThank you,\nYARD`
    );
  }
  return text;
}

export const checkQuote = internalAction({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, { quoteId }) => {
    const quote = await ctx.runQuery(internal.quotes.getInternal, { quoteId });
    if (!quote) return;

    await ctx.runMutation(internal.quotes.setStatusInternal, {
      quoteId,
      status: "checking",
    });

    try {
      let targetUrl = quote.pageUrl;
      if (!targetUrl) {
        const search = await firecrawl.search(
          ctx,
          `${quote.supplierName} ${quote.material} price`,
          {
            limit: 3,
            scrapeOptions: {
              formats: [
                {
                  type: "json",
                  prompt: "Extract the unit price",
                  schema: {
                    type: "object",
                    properties: {
                      unit_price: { type: "number" },
                      currency: { type: "string" },
                      product_name: { type: "string" },
                    },
                    required: ["unit_price"],
                  },
                },
              ],
            },
          },
        );
        const first = (search as { data?: Array<{ url?: string; json?: ExtractJson }> })?.data?.[0];
        targetUrl = first?.url;
        const fromSearch = readUnitPrice(first?.json);
        if (fromSearch != null && targetUrl) {
          await finishCompare(ctx, quoteId, quote.quotedUnitPrice, fromSearch, targetUrl, quote);
          return;
        }
      }

      if (!targetUrl) {
        await ctx.runMutation(internal.quotes.markAmber, {
          quoteId,
          extractError: "No public URL found for Firecrawl extract",
        });
        return;
      }

      const scraped = await firecrawl.scrape(ctx, targetUrl, {
        formats: [
          {
            type: "json",
            prompt: "Extract the unit price",
            schema: {
              type: "object",
              properties: {
                unit_price: { type: "number" },
                currency: { type: "string" },
                product_name: { type: "string" },
              },
              required: ["unit_price"],
            },
          },
        ],
        onlyMainContent: true,
      });

      const json = (scraped as { json?: ExtractJson }).json;
      const pageUnitPrice = readUnitPrice(json);
      if (pageUnitPrice == null) {
        await ctx.runMutation(internal.quotes.markAmber, {
          quoteId,
          extractError: "Firecrawl did not return a unit_price",
        });
        return;
      }

      await finishCompare(ctx, quoteId, quote.quotedUnitPrice, pageUnitPrice, targetUrl, quote);
    } catch (err) {
      await ctx.runMutation(internal.quotes.markAmber, {
        quoteId,
        extractError: err instanceof Error ? err.message : "Firecrawl check failed",
      });
    }
  },
});

async function finishCompare(
  ctx: { runMutation: Function; runAction: Function },
  quoteId: any,
  quotedUnitPrice: number,
  pageUnitPrice: number,
  pageUrl: string,
  quote: {
    material: string;
    supplierName: string;
    agentmailInboxId?: string;
    agentmailMessageId?: string;
  },
) {
  if (quotedUnitPrice <= pageUnitPrice) {
    await ctx.runMutation(internal.quotes.markMatched, {
      quoteId,
      pageUnitPrice,
      pageUrl,
    });
    return;
  }

  await ctx.runMutation(internal.quotes.setPagePrice, {
    quoteId,
    pageUnitPrice,
    pageUrl,
  });

  // No AgentMail thread (portal/manual) → fail closed, keep page price, no invented reply.
  if (!quote.agentmailInboxId || !quote.agentmailMessageId) {
    await ctx.runMutation(internal.quotes.markAmber, {
      quoteId,
      extractError: `Quoted ${quotedUnitPrice} above page ${pageUnitPrice}; no AgentMail thread to auto-reply.`,
    });
    return;
  }

  try {
    const text = await draftCounterEmail({
      material: quote.material,
      quotedUnitPrice,
      pageUnitPrice,
      pageUrl,
      supplierName: quote.supplierName,
    });
    await ctx.runAction(internal.email.sendCounterReply, { quoteId, text });
  } catch (err) {
    await ctx.runMutation(internal.quotes.markCounterFailed, {
      quoteId,
      draftError: err instanceof Error ? err.message : "Draft/send failed",
    });
  }
}
