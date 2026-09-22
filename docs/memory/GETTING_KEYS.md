# How to get Convex / Firecrawl / AgentMail credentials

Last updated: 2026-09-22. No secret values in this file.

## 1) Convex login + cloud project (required for `*.convex.site`)

This cloud agent **cannot** complete browser login alone.

1. Open [https://dashboard.convex.dev/auth](https://dashboard.convex.dev/auth)
2. Sign in / create account
3. Copy the **CLI login token**
4. Paste it in chat as `CONVEX_LOGIN_TOKEN=…`

Then the agent runs (non-interactive):

```bash
npx convex login --device-name cursor-cloud-yard --no-open --login-flow paste
# paste token when prompted, or use whatever pipe the CLI accepts

npx convex dev --once --configure=existing   # or new project "yard"
npm run deploy                               # @convex-dev/static-hosting → *.convex.site
```

Until this succeeds, only the **anonymous local** backend at `http://127.0.0.1:3210` works.

## 2) FIRECRAWL_API_KEY

1. Open [https://www.firecrawl.dev/app](https://www.firecrawl.dev/app) and sign up / sign in  
2. Dashboard → **API Keys** → create key (`fc-…`)  
3. Optional: Settings → Advanced → **webhook signing secret** → `FIRECRAWL_WEBHOOK_SECRET`  
4. Paste `FIRECRAWL_API_KEY=fc-…` in chat (or set in Convex dashboard after login)

Docs: [Firecrawl dashboard](https://docs.firecrawl.dev/dashboard) · hackathon includes Firecrawl participant credits.

After Convex cloud is linked:

```bash
npx convex env set FIRECRAWL_API_KEY=fc-...
# optional:
npx convex env set FIRECRAWL_WEBHOOK_SECRET=whsec-...
```

## 3) AGENTMAIL_API_KEY + AGENTMAIL_WEBHOOK_SECRET

### Fast path (agent signup — already started for this build)
1. Agent signup was called for `jasonneil4040@gmail.com` / username `yard-allgas`
2. Check that email for a **6-digit OTP**
3. Reply `AGENTMAIL_OTP=######`
4. Agent will verify, create inbox, register webhook at  
   `https://<deployment>.convex.site/agentmail/webhook`, and set Convex env vars

### Human console path
1. [AgentMail Console](https://console.agentmail.to) → create account → API key (`am_…`)
2. Create an inbox → copy `inbox_id`
3. Create webhook URL = `https://<your-deployment>.convex.site/agentmail/webhook`  
   event: `message.received` → copy webhook secret → `AGENTMAIL_WEBHOOK_SECRET`
4. In YARD Settings (owner) paste the inbox id, or:

```bash
npx convex env set AGENTMAIL_API_KEY=am_...
npx convex env set AGENTMAIL_WEBHOOK_SECRET=whsec_...
```

Docs: [AgentMail quickstart](https://www.agentmail.to/docs/quickstart) · [webhook setup](https://www.agentmail.to/docs/webhook-setup)

## 4) LLM draft (already wired)

- Prefer Convex AI Gateway if on a **paid** Convex team  
- Else `AGENTROUTER_API_KEY` on Convex env (action egress — good if working)  
- Never put LLM keys in the browser

## 5) Submission (due Sep 22, 12:00 PM PT)

Submit at: https://vibeapps.dev/judging/convex-all-gas-hackathon-openai/submit  

Need: public GitHub · `hackathon.md` · live `convex.site` or `chatgpt.site` · ≤3 min video · tags Convex/OpenAI/Firecrawl/AgentMail · social post
