# Session log

## 2026-09-22 — Auth email-only + demo script

- Removed non-working Google/GitHub buttons from `/auth` (email + password only).
- Sign-in now lands on the **stored membership role** home (owner→dashboard, buyer→board, etc.), not the form default.
- Confirmed multitenancy: each signup bootstraps its own org; queries gated by `orgId` + `requireMembership`.
- Role nav filtered in shell; Protected gate blocks wrong-role routes.
- Click-by-click demo script: `docs/DEMO_SCRIPT.md`.

## 2026-09-22 — Screenshot UX fixes live

- Centered `EmptyState` + CTAs on inbox/dashboard (and other empty CRM pages).
- Metric notes wrap; High-quote copy shortened; sidebar padding + brand size.
- Aurora auth: contrast on placeholders/roles/steps, sticky header, bootstrap retry after signIn race.
- Favicon ASSET_V `v=3` cache-bust on prod.
- Verified via Playwright signup → inbox → dashboard screenshots.

## 2026-09-22 — Auth UX + full demo

- Aurora-style `/auth` live (motion + CloudFront hero video + password Convex Auth).
- Favicon / apple-touch / `og.png` / webmanifest on prod; `seoHead` on all marketing routes.
- Marketing copy polished; full demo of marketing + auth + dashboard/inbox/board/settings.
- Live: https://brainy-horse-649.convex.site

## 2026-09-22 — Cloud deploy live

- Convex login → team `henry-marfo` / project `yard`.
- Prod: `brainy-horse-649` · Dev: `fabulous-donkey-651`.
- Env: FIRECRAWL, AGENTMAIL (+ webhook), AGENTROUTER, JWT/JWKS, SITE_URL.
- AgentMail inbox `yard-allgas@agentmail.to` → prod webhook.

## 2026-09-22 — Full feature run + submission demo

- Full CRM/marketing E2E passed; materials add form shipped.
- Spine verified live: AgentMail inbound → Firecrawl → counter reply (`yard-counter`).
- Fixes: price parser, LLM template fallback, direct AgentMail reply action, Countered status.
- Demo: `/opt/cursor/artifacts/yard_all_gas_demo.mp4` (~29s).
