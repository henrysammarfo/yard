# Key status (no secret values)

Updated: 2026-09-22T07:10Z. Store live keys only in Convex env — never in git or `hackathon.md`.

| Secret | Status | Needed for |
|--------|--------|------------|
| Convex cloud login token | **Blocked** — paste from https://dashboard.convex.dev/auth | `convex.site` deploy |
| FIRECRAWL_API_KEY | Needed from https://www.firecrawl.dev/app (keyless scrape works for smoke; Convex component needs `fc-…`) | Price extract |
| AGENTMAIL_API_KEY | Obtained via agent signup · set on **local anonymous** Convex env · OTP verify pending | Inbound + reply |
| AGENTMAIL inbox | `yard-allgas@agentmail.to` | Live mail |
| AGENTMAIL_WEBHOOK_SECRET | Pending webhook create after cloud URL exists | Signed webhooks |
| AGENTMAIL_OTP | Waiting on human email / chat | Verify agent |
| AGENTROUTER_API_KEY | Set on local Convex env earlier (egress path) | Counter draft |
| Tavily | **New key works** (research) | Research only |
| TinyFish | **New key works** (credits OK; smoke run completed) | Research / optional |
| OpenAI | None — use Gateway if paid Convex, else AgentRouter | Draft |

Rotate all keys after the hackathon.
