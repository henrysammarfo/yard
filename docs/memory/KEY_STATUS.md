# Key status (no secret values)

Updated: 2026-09-22T11:26Z. Store live keys only in Convex env — never in git or `hackathon.md`.

| Secret | Status | Needed for |
|--------|--------|------------|
| Convex cloud login | **OK** — team `henry-marfo`, project `yard` | `convex.site` deploy |
| FIRECRAWL_API_KEY | **OK** — set on cloud prod + dev | Price extract |
| AGENTMAIL_API_KEY | **OK** — set on cloud prod + dev | Inbound + reply |
| AGENTMAIL inbox | `yard-allgas@agentmail.to` | Live mail |
| AGENTMAIL_WEBHOOK_SECRET | **OK** — prod webhook → `brainy-horse-649.convex.site` | Signed webhooks |
| AGENTROUTER_API_KEY | **OK** — set on cloud prod + dev | Counter draft |
| JWT / JWKS / SITE_URL | **OK** — Convex Auth on cloud | Sessions |
| Tavily | New key works (research) | Research only |
| TinyFish | New key works | Research / optional |

Rotate all keys after the hackathon.

## Live URLs

- **Prod site:** https://brainy-horse-649.convex.site
- **Prod cloud:** https://brainy-horse-649.convex.cloud
- **Dev site:** https://fabulous-donkey-651.convex.site
- **Dashboard:** https://dashboard.convex.dev/t/henry-marfo/yard
