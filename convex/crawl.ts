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

  const gatewayToken = await tryGatewayToken();
  if (gatewayToken) {
    const openai = new OpenAI({
      baseURL: "https://ai-gateway.convex.dev/v1",
      apiKey: gatewayToken,
    });
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (text) return enforcePrices(text, args.quotedUnitPrice, args.pageUnitPrice);
  }

  const agentRouterKey = process.env.AGENTROUTER_API_KEY;
  if (agentRouterKey) {
    const openai = new OpenAI({
      baseURL: "https://agentrouter.org/v1",
      apiKey: agentRouterKey,
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (text) return enforcePrices(text, args.quotedUnitPrice, args.pageUnitPrice);
  }

  const veniceKey = process.env.VENICE_API_KEY;
  if (veniceKey) {
    const openai = new OpenAI({
      baseURL: "https://api.venice.ai/api/v1",
      apiKey: veniceKey,
    });
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (text) return enforcePrices(text, args.quotedUnitPrice, args.pageUnitPrice);
  }

  throw new Error("No LLM provider available (AI Gateway / AgentRouter / Venice)");
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

  try {
    const text = await draftCounterEmail({
      material: quote.material,
      quotedUnitPrice,
      pageUnitPrice,
      pageUrl,
      supplierName: quote.supplierName,
    });
    if (!quote.agentmailInboxId || !quote.agentmailMessageId) {
      await ctx.runMutation(internal.quotes.markCounterFailed, {
        quoteId,
        draftError: "Missing AgentMail message ids for reply",
      });
      return;
    }
    await ctx.runMutation(internal.email.replyWithCounter, { quoteId, text });
  } catch (err) {
    await ctx.runMutation(internal.quotes.markCounterFailed, {
      quoteId,
      draftError: err instanceof Error ? err.message : "Draft/send failed",
    });
  }
}
