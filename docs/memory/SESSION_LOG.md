# Session log

## 2026-09-22 — All Gas setup + plan lock
- Read YARD Bible; audited Lovable demo (localStorage + simulated integrations).
- Locked Option B (full CRM on Convex) + `convex.site` + AgentRouter via Convex egress.
- Installed `.agents/skills/*` (Convex + hackathon skill), MCP convex entry, started `hackathon.md`.
- `CONVEX_AGENT_MODE=anonymous npx convex init` → local backend `http://127.0.0.1:3210`.
- Packages: `convex`, `@convex-dev/auth`, `@firecrawl/firecrawl-convex`, `@agentmail/convex`, `openai`, `@convex-dev/static-hosting`.

## 2026-09-22 — Build complete (local anonymous Convex)
- Convex backend + AgentMail/Firecrawl/static-hosting components pushed to local anonymous deployment.
- Full CRM rewired to Convex queries/mutations; Auth Password + org bootstrap; no localStorage.
- `npm run build` succeeds. Cloud `convex.site` deploy blocked on `npx convex login` + real FIRECRAWL/AGENTMAIL keys.
