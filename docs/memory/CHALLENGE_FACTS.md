# YARD — Challenge facts (verified)

Last verified: 2026-09-22. Do not invent stats or APIs.

## Product (from YARD Bible)

- Soft: Supplier emails a price; YARD checks their public website; if high, writes back before you buy.
- Unique job: Quote cannot pass until the supplier’s own page agrees.
- Fail-closed: If Firecrawl extract fails → amber row → **no outbound mail**. OpenAI/LLM may phrase around the extracted number only; never invent a figure.
- Beachhead: Small builders / yard buyers US / EU / APAC. Accra = build origin, not ICP.
- Kill list: Price dashboard with no reply · chat-email clone · AI COO · model-invented prices · AFTERCUT port.

## Sponsor stack (npm + docs verified)

| Piece | Package / docs | Notes |
|-------|----------------|-------|
| Convex Firecrawl | `@firecrawl/firecrawl-convex` 0.1.1 | scrape / search / startCrawl; structured JSON extract |
| Convex AgentMail | `@agentmail/convex` 0.1.0 | webhook + replyToMessage; mount `/agentmail/webhook` |
| Convex AI Gateway | docs.convex.dev/ai-gateway | Paid team only; free → `AiGatewayDisabled` |
| Static hosting | `@convex-dev/static-hosting` | Target `*.convex.site` |

## Event

- Event name: Convex All Gas Hackathon
- Submit: vibeapps.dev (Convex All Gas / OpenAI)
- Deadline (as of brief): 2026-09-22 12:00 PM PT
- Required: public repo · `hackathon.md` · live `convex.site` or `chatgpt.site` · ≤3 min video

## Honesty constraints

- Public pages only; login-walled prices stay amber.
- Not procurement advice.
- Do not claim unhackable; ship org isolation, signed webhooks, secrets in Convex env, fail-closed mail.
