# Key status (no secret values)

Updated: 2026-09-22. Store live keys only in Convex dashboard / env — never in git or `hackathon.md`.

| Secret | Status | Needed for |
|--------|--------|------------|
| Convex cloud login / deploy key | Local anonymous backend running; cloud deploy needs account login | `convex.site` |
| FIRECRAWL_API_KEY | Not set yet | Price extract |
| AGENTMAIL_API_KEY | Not set yet | Inbound + reply |
| AGENTMAIL_WEBHOOK_SECRET | Not set yet | Signed webhooks |
| AGENTROUTER_API_KEY | Provided for product; set on Convex env (not browser). Agent VM WAF-blocked; Convex egress is the path | Counter draft |
| Convex AI Gateway | Needs paid Convex team | Prefer if available |
| Tavily | Over plan limit | Research only |
| TinyFish | 0 credits | Research / optional browser |
| Venice | No key | Optional LLM |
| OpenAI | None (per owner) | Prefer Gateway / AgentRouter |

Rotate all keys after the hackathon.
