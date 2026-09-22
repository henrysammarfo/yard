---
name: yard-all-gas
description: Build and ship YARD for the Convex All Gas Hackathon — fail-closed Firecrawl price check, AgentMail reply, full CRM on Convex, convex.site hosting, hackathon.md updates. Use when working on YARD spine, CRM rewire, deploy, or /hackathon.
---

# YARD All Gas build skill

## When to use
Any YARD product work for All Gas: spine, CRM, auth, deploy, or build log.

## Mandatory spine
1. Inbound AgentMail → pending quote row (`orgId` required).
2. Firecrawl search (if no URL) then scrape with structured JSON unit price.
3. Extract fail → amber, stop (no mail).
4. quoted > page → LLM draft from numbers only → `replyToMessage` → countered.
5. Match → green matched, no reply.

## LLM
Prefer Convex AI Gateway if paid; else AgentRouter from Convex action egress with `AGENTROUTER_API_KEY`. Fail-closed on draft failure.

## CRM
Full Option B surfaces subscribe to Convex. No simulated integration badges.

## Deploy
`@convex-dev/static-hosting` → `npm run deploy` → `*.convex.site`. Update `hackathon.md` via the hackathon skill after meaningful progress.

## Honesty
Public pages only. No invented prices. No unhackable claims — org isolation, signed webhooks, env secrets.
