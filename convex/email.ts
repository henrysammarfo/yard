import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { initialsFrom, logActivity, parseQuoteFromEmail } from "./lib/access";

/** Resolve which org owns an AgentMail inbox. */
export const orgForInbox = internalQuery({
  args: { inboxId: v.string() },
  handler: async (ctx, { inboxId }) => {
    const orgs = await ctx.db.query("organizations").take(50);
    return orgs.find((o) => o.inboxId === inboxId) ?? orgs[0] ?? null;
  },
});

export const onMessageReceived = internalMutation({
  args: {
    message: v.any(),
    thread: v.any(),
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = args.message as {
      inbox_id?: string;
      message_id?: string;
      thread_id?: string;
      subject?: string;
      text?: string;
      from_?: string[] | string;
      from?: string[] | string;
    };

    const inboxId = message.inbox_id;
    const messageId = message.message_id;
    if (!inboxId || !messageId) {
      return;
    }

    const existing = await ctx.db
      .query("quotes")
      .withIndex("by_message", (q) => q.eq("agentmailMessageId", messageId))
      .first();
    if (existing) {
      return;
    }

    const org = await ctx.runQuery(internal.email.orgForInbox, { inboxId });
    if (!org) {
      return;
    }

    const fromRaw = message.from_ ?? message.from;
    const fromStr = Array.isArray(fromRaw)
      ? (fromRaw[0] ?? "Supplier")
      : String(fromRaw ?? "Supplier");
    const supplierName = fromStr.replace(/<[^>]+>/g, "").trim() || "Supplier";

    let parsed;
    try {
      parsed = parseQuoteFromEmail(message.text ?? "", message.subject);
    } catch (err) {
      const publicId = `QT-${Date.now().toString().slice(-6)}`;
      const quoteId = await ctx.db.insert("quotes", {
        orgId: org._id,
        publicId,
        supplierName,
        supplierInitials: initialsFrom(supplierName),
        material: message.subject ?? "Unparsed quote",
        specification: "Could not parse unit price from email",
        quantity: "—",
        quotedUnitPrice: 0,
        status: "amber",
        confidence: 0,
        agentmailInboxId: inboxId,
        agentmailMessageId: messageId,
        agentmailThreadId: message.thread_id,
        sourceSubject: message.subject,
        sourceText: message.text,
        extractError: err instanceof Error ? err.message : "Parse failed",
        receivedAt: Date.now(),
      });
      await logActivity(ctx, {
        orgId: org._id,
        title: `${publicId} stayed amber`,
        detail: "Inbound mail could not yield a unit price — no reply sent.",
        type: "mail",
        quoteId,
      });
      return;
    }

    const publicId = `QT-${Date.now().toString().slice(-6)}`;
    const quoteId = await ctx.db.insert("quotes", {
      orgId: org._id,
      publicId,
      supplierName: parsed.supplierName === "Supplier" ? supplierName : parsed.supplierName,
      supplierInitials: initialsFrom(supplierName),
      material: parsed.material,
      specification: parsed.specification,
      quantity: parsed.quantity,
      quantityNumber: parsed.quantityNumber,
      quotedUnitPrice: parsed.quotedUnitPrice,
      pageUrl: parsed.pageUrl,
      status: "pending",
      confidence: 90,
      agentmailInboxId: inboxId,
      agentmailMessageId: messageId,
      agentmailThreadId: message.thread_id,
      sourceSubject: message.subject,
      sourceText: message.text,
      receivedAt: Date.now(),
    });

    await logActivity(ctx, {
      orgId: org._id,
      title: `${publicId} entered pending`,
      detail: "AgentMail received a supplier quote; Firecrawl check scheduled.",
      type: "mail",
      quoteId,
    });

    await ctx.scheduler.runAfter(0, internal.crawl.checkQuote, { quoteId });
  },
});

export const markCountered = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    text: v.string(),
  },
  handler: async (ctx, { quoteId, text }) => {
    const quote = await ctx.db.get(quoteId);
    if (!quote) return;
    await ctx.db.patch(quoteId, {
      status: "countered",
      counterText: text,
      checkedAt: Date.now(),
      draftError: undefined,
    });
    await logActivity(ctx, {
      orgId: quote.orgId,
      title: `${quote.publicId} countered`,
      detail: "AgentMail sent a counter using the supplier page unit price only.",
      type: "send",
      quoteId,
    });
  },
});

/**
 * Send counter via AgentMail HTTP from the parent deployment action
 * (component actions cannot see parent AGENTMAIL_API_KEY env).
 */
export const sendCounterReply = internalAction({
  args: {
    quoteId: v.id("quotes"),
    text: v.string(),
  },
  handler: async (ctx, { quoteId, text }) => {
    const quote = await ctx.runQuery(internal.quotes.getInternal, { quoteId });
    if (!quote?.agentmailInboxId || !quote.agentmailMessageId) {
      await ctx.runMutation(internal.quotes.markCounterFailed, {
        quoteId,
        draftError: "Quote missing AgentMail identifiers",
      });
      return;
    }

    const apiKey = process.env.AGENTMAIL_API_KEY;
    if (!apiKey) {
      await ctx.runMutation(internal.quotes.markCounterFailed, {
        quoteId,
        draftError: "AGENTMAIL_API_KEY missing on deployment",
      });
      return;
    }

    const inboxId = encodeURIComponent(quote.agentmailInboxId);
    const messageId = encodeURIComponent(quote.agentmailMessageId);
    const url = `https://api.agentmail.to/v0/inboxes/${inboxId}/messages/${messageId}/reply`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        labels: ["yard-counter"],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      await ctx.runMutation(internal.quotes.markCounterFailed, {
        quoteId,
        draftError: `AgentMail reply failed (${res.status}): ${body.slice(0, 200)}`,
      });
      return;
    }

    await ctx.runMutation(internal.email.markCountered, { quoteId, text });
  },
});

/** Kept for compatibility — schedules sendCounterReply. */
export const replyWithCounter = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    text: v.string(),
  },
  handler: async (ctx, { quoteId, text }) => {
    await ctx.scheduler.runAfter(0, internal.email.sendCounterReply, {
      quoteId,
      text,
    });
    await ctx.db.patch(quoteId, { counterText: text });
  },
});
