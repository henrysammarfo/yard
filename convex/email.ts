import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { AgentMail } from "@agentmail/convex";
import { initialsFrom, logActivity, parseQuoteFromEmail } from "./lib/access";

const agentmail = new AgentMail(components.agentmail);

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

export const replyWithCounter = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    text: v.string(),
  },
  handler: async (ctx, { quoteId, text }) => {
    const quote = await ctx.db.get(quoteId);
    if (!quote?.agentmailInboxId || !quote.agentmailMessageId) {
      throw new Error("Quote missing AgentMail identifiers");
    }
    await agentmail.replyToMessage(ctx, quote.agentmailInboxId, quote.agentmailMessageId, {
      text,
      labels: ["yard-counter"],
    });
    await ctx.db.patch(quoteId, {
      status: "countered",
      counterText: text,
      checkedAt: Date.now(),
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
