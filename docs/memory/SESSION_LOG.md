# Session log

## 2026-09-22 — Cloud deploy live

- Convex login via dashboard paste token → PAT exchange → team `henry-marfo` / project `yard`.
- Prod: `brainy-horse-649` · Dev: `fabulous-donkey-651`.
- Env on prod+dev: FIRECRAWL, AGENTMAIL (+ webhook secret), AGENTROUTER, JWT/JWKS, SITE_URL.
- AgentMail inbox `yard-allgas@agentmail.to`; webhook → `https://brainy-horse-649.convex.site/agentmail/webhook`.
- TanStack Start SPA mode (`index.html`) + `@convex-dev/static-hosting` upload → live site.
- Firecrawl CLI skills installed (npx); key set on Convex env.

## 2026-09-22 — Build complete (local anonymous Convex)

- Convex backend + AgentMail/Firecrawl/static-hosting components pushed to local anonymous deployment.
- `npm run build` succeeds. Cloud `convex.site` deploy was blocked until login + sponsor keys (now done).

## Earlier

- `CONVEX_AGENT_MODE=anonymous npx convex init` → local backend `http://127.0.0.1:3210`.
- Packages: `convex`, `@convex-dev/auth`, `@firecrawl/firecrawl-convex`, `@agentmail/convex`, `openai`, `@convex-dev/static-hosting`.
