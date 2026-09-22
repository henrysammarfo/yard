# Vibeapps / All Gas — submit form (copy-paste)

Fill the form exactly from this page. Paste into each field.

---

## App Title *

```
YARD
```

---

## App/Project Tagline * (≤140 chars)

```
Checks supplier email quotes against the supplier’s public page — and counters only when the unit price is high.
```

Character count: 112

---

## Description * (Markdown OK)

```markdown
## Problem

Buyers still get supplier prices by email. Those quotes are easy to overpay on, and checking a public price by hand is slow and inconsistent.

## How YARD works

1. A supplier email arrives via **AgentMail**
2. **Firecrawl** reads the unit price on that supplier’s **public** product page
3. YARD compares quoted unit price vs page unit price
4. **Only if the email is higher** — it drafts a short counter from those two numbers and replies
5. If the page price cannot be read — the quote stays amber and **no email goes out** (fail-closed)

Each signup creates its **own organisation**. Data is not shared between accounts.

## Notable features

- Live CRM: inbox, board, approvals, materials, suppliers, purchase orders, activity, team, settings
- Roles: Owner, Buyer, Staff, Supplier — each lands on the right home and is blocked from the wrong pages
- Email + password auth (Convex Auth)
- Supplier portal to submit a unit price for a live Firecrawl check
- Realtime board: quoted vs page, status, variance
- Settings persist per organisation (notify email, assignee, AgentMail inbox id)

## Why we built this

Everyday buyers deserve a simple gate before they spend: *does the supplier’s own page agree with this email?* YARD is that gate — not a price dashboard, not a chat clone.

## Tech stack

- **Convex** — database, functions, realtime, static hosting (`*.convex.site`)
- **Convex Auth** — password signup / sign-in
- **AgentMail** (`@agentmail/convex`) — inbound webhook + outbound counter reply
- **Firecrawl** (`@firecrawl/firecrawl-convex`) — public page unit-price extract
- **OpenAI-compatible draft** (AgentRouter) — counter wording from extracted numbers only
- **TanStack Start + React + Vite + Tailwind** — marketing site + CRM UI

Convex features used: schema, indexes, queries, mutations, actions, HTTP actions, scheduled functions, realtime queries, components.

## Challenges

- AgentMail component pool cannot read the parent deployment’s API key — counter send runs as a parent-deployment action
- Some LLM egress paths are blocked — template draft fallback keeps counters shipping from the two numbers
- Price parsing must ignore sizes like `50kg` so they are never treated as money
- Each org must load its own saved settings (notify / inbox) after save

## Proof on prod

Live: https://brainy-horse-649.convex.site  

Verified path: high inbound quote → Firecrawl page price → numbers-only AgentMail counter reply.  

Try: sign up → Settings inbox `yard-allgas@agentmail.to` → Supplier portal with  
`https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html`  
at unit price `40` (match) and `99.5` (counter).
```

---

## App Website Link *

```
https://brainy-horse-649.convex.site
```

---

## Video Demo (Recommended)

```
PASTE_YOUR_YOUTUBE_OR_VIMEO_URL_HERE
```

Record with `docs/DEMO_PASTE.md` + `docs/DEMO_SCRIPT.md` (≤3 minutes).

---

## Your Name *

```
Henry Marfo
```

---

## Email (Optional)

```
henrysammarfo@gmail.com
```

---

## Upload Screenshot (Recommended)

Use a clear full-width shot of:

1. Live board with Matched / Countered rows, **or**
2. Marketing home + auth, **or**
3. Quote detail (quoted vs page)

If you have local agent artifacts, good files include:

- `/opt/cursor/artifacts/screenshots/full-07-board-after-spine.png`
- `/opt/cursor/artifacts/screenshots/full-08-quote-detail.png`
- `/opt/cursor/artifacts/screenshots/demo-01-home.png`
- `/opt/cursor/artifacts/screenshots/demo-04-dashboard.png`

Upload **one** as main screenshot; up to **4** more as additional images.

---

## GitHub Repo URL (Optional)

```
https://github.com/henrysammarfo/yard
```

---

## LinkedIn / X (optional)

Leave blank unless you have a post URL ready.

---

## Team Info (Optional)

Leave blank if solo — or add teammates if any.

---

## Select Tags *

Check these:

- `convex`
- `AllGasHackathon`
- `OpenAI`
- `Firecrawl`
- `AgentMail`

Optional extras if available: `TanStack`, `Realtime`, `Auth`

---

## Before you click Submit App

- [ ] Title + tagline + description pasted
- [ ] Website = `https://brainy-horse-649.convex.site`
- [ ] Video URL pasted (after you upload the recording)
- [ ] Name + email filled
- [ ] At least one screenshot uploaded
- [ ] GitHub repo linked
- [ ] Tags selected (convex + AllGasHackathon + Firecrawl + AgentMail + OpenAI)
- [ ] README on GitHub looks correct (no secrets)
