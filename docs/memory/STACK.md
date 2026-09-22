# YARD stack (locked)

## Frontend
- TanStack Start + React 19 + Vite 8 + Tailwind 4 + shadcn
- Host: Convex Static Hosting → `*.convex.site`

## Backend
- Convex (queries, mutations, actions, HTTP actions, scheduler)
- Components: `@firecrawl/firecrawl-convex`, `@agentmail/convex`, `@convex-dev/auth`, `@convex-dev/static-hosting` (deploy)

## Spine
AgentMail inbound → Convex quote row → Firecrawl extract unit price → compare → LLM draft (numbers only) → AgentMail reply on high quote only

## LLM path (no OpenAI key)
1. Convex AI Gateway if paid team
2. AgentRouter OpenAI-compatible from **Convex action egress** (`AGENTROUTER_API_KEY` in Convex env)
3. Venice if key provided later
Fail-closed: if draft fails → `counter_failed`, no mail

## Multitenancy / sessions
- `orgId` on every business row
- Convex Auth sessions (no localStorage for auth or workspace state)

## Research tools (not product spine)
- Tavily: over quota as of 2026-09-22
- TinyFish Agent API: auth OK, 0 credits as of 2026-09-22
