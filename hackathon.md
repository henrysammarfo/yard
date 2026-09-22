# Hackathon log

- **Project:** YARD
- **Event:** Convex All Gas Hackathon
- **What it does:** Checks supplier emails against the supplier’s own public page and replies with a counter only when the quoted unit price is higher than the page price.
- **Live app:** https://brainy-horse-649.convex.site
- **Repo:** https://github.com/henrysammarfo/yard
- **Frontend:** Convex static hosting
- **Convex deployment:** brainy-horse-649 (prod) · fabulous-donkey-651 (dev)
- **Components:** @firecrawl/firecrawl-convex, @agentmail/convex, @convex-dev/auth, @convex-dev/static-hosting
- **Convex features:** schema, indexes, queries, mutations, actions, HTTP actions, scheduled functions, realtime queries
- **Auth:** Convex Auth
- **AI models:** gpt-4o-mini via AgentRouter (OpenAI-compatible); Convex AI Gateway when paid team available
- **Started:** 2026-09-08T06:54:42Z
- **Last updated:** 2026-09-22T11:26:00Z

## Log

### 2026-09-08 - 5081cd0
Started from the TanStack Start TypeScript template at repo root.

### 2026-09-15 - cc157d6
Built the public YARD marketing site and navigation over the Alwayzz hero template (`src/routes`, `src/components/yard`).

### 2026-09-15 - 4ffecad
Applied the Alwayzz hero layout to YARD landing (`src/routes/index.tsx`).

### 2026-09-22 - f28ca20
Added demo auth roles and a browser-local workspace store for the hybrid CRM preview (`src/lib/yard-session.ts`, `src/lib/yard-store.ts`). No Convex backend yet.

### 2026-09-22 - working tree
Installed All Gas agent skills under `.agents/skills/` (including `convex-hackathon-skill`), configured Convex MCP at `~/.cursor/mcp.json`, and started this build log. Frontend host locked to Convex static hosting (`convex.site`). Product build and Convex init not started in this setup step.

### 2026-09-22 - working tree
Rewired YARD to live Convex: multitenant schema, Convex Auth (no localStorage), AgentMail webhook → Firecrawl unit-price check → fail-closed amber / counter via AgentRouter egress → live CRM queries (`convex/`, `src/lib/yard-session.ts`, `src/components/yard/*`). Frontend host remains Convex static hosting; cloud `convex.site` deploy awaits Convex account login + sponsor keys.

### 2026-09-22 - cloud deploy
Logged into Convex (team `henry-marfo`, project `yard`), set FIRECRAWL / AGENTMAIL / AGENTROUTER / Auth env on prod+dev, registered AgentMail webhook to prod site, enabled TanStack Start SPA `index.html` build, and uploaded static hosting. Live: https://brainy-horse-649.convex.site · inbox `yard-allgas@agentmail.to`.
