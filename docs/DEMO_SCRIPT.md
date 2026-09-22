# YARD — Demo video script (copy & shoot)

**Live:** https://brainy-horse-649.convex.site  
**Length target:** ≤ 3 minutes · brief voiceover · show the clicks  
**Auth:** Email + password only (no Google / GitHub)

Record fullscreen Chrome. Speak short lines. Pause ~1s on each screen so judges can read.

---

## Prep (before you hit record)

1. Use a **new** email each take (e.g. `yard-demo-owner-22@example.com`).
2. Password: anything ≥ 8 chars (e.g. `YardDemo99!`).
3. Optional spine proof: have AgentMail ready so a high quote can land mid-video (inbox `yard-allgas@agentmail.to`). If mail is slow, still show Inbox → Board → Approvals → Activity with existing data.

---

## Shot list + what to say

### 1. Landing (0:00–0:20)

| Click | Say (short) |
| --- | --- |
| Open `/` | “YARD — supplier quotes checked against the supplier’s own page.” |
| Scroll once through hero → how it works | “Inbound email in. Firecrawl check. Counter only when the unit price is high.” |
| Click **Sign in** / **Get started** → `/auth` | “Every judge gets their own account and org.” |

### 2. Sign up as Owner (0:20–0:45)

| Click | Say (short) |
| --- | --- |
| Stay on **Create New Profile** | — |
| First / last name | — |
| Organization: `Demo Buyers Co` | “Own org per signup — not shared with anyone else.” |
| Role: **Owner** | “Owner lands on the full dashboard.” |
| Email + password → **Create Account** | — |
| Land on `/dashboard` | “Overview: spend, quotes, approvals.” |

### 3. Workspace tour — Owner (0:45–1:25)

| Click | Say (short) |
| --- | --- |
| Sidebar → **Materials** → add one material (name + unit) | “Catalog the SKUs you buy.” |
| **Suppliers** → add supplier + page URL if empty | “Public page URL is what Firecrawl reads.” |
| **Inbox** | “Quotes arrive from AgentMail into this org only.” |
| **Live board** | “Each row: quoted vs page price, status, confidence.” |
| Open one quote (if any) | “Matched means prices agree. High quote → counter draft.” |
| **Approvals** | “Owner / buyer approve spend.” |
| **Purchase orders** | “Approved quotes become POs.” |
| **Activity** | “Full audit trail.” |
| **Team & roles** / **Settings** (owner-only) | “Only the owner sees team and settings.” |

### 4. Counter spine if live mail is ready (1:25–1:55)

| Click | Say (short) |
| --- | --- |
| Stay on **Inbox** or **Live board** | “Supplier emails a high unit price…” |
| Wait for new quote / refresh board | “…YARD crawls their page, compares unit prices.” |
| Open the quote → show **Countered** / counter text | “Reply goes back only when the quote is above the page.” |
| **Activity** | “Logged end to end.” |

*If no live mail:* skip and say “Same loop is wired on prod AgentMail → Firecrawl → counter.” Then go to step 5.

### 5. Role persistence — Buyer (1:55–2:25)

| Click | Say (short) |
| --- | --- |
| Sign out (user chip → logout) | — |
| **Create New Profile** again | “Second account = second org.” |
| Org: `Buyer Demo Co` · Role: **Buyer** | “Buyer only — not owner.” |
| Create Account → lands on `/board` | “Buyer home is the live board, not settings.” |
| Try sidebar: no Settings / limited nav | “Role sticks on every sign-in.” |
| Optionally hit `/settings` URL | Gate: “Not available for the buyer role.” |

### 6. Close (2:25–2:45)

| Click | Say (short) |
| --- | --- |
| Back to `/` or board | “YARD: check the page, counter the high quote, keep the org private.” |
| Stop recording | — |

---

## Narration cheat-sheet (one breath each)

1. “YARD checks supplier email against the supplier’s public page.”
2. “Each signup gets its own org — judges don’t share my data.”
3. “Owner sees dashboard, team, settings.”
4. “Buyer lands on the board and can’t open settings.”
5. “High unit price → Firecrawl → counter reply. Done.”

---

## Submit checklist

- [ ] Video ≤ 3 min, shows signup (email/password), owner flow, buyer role home
- [ ] Live URL: `https://brainy-horse-649.convex.site`
- [ ] Repo + Convex deployment noted on vibeapps form
- [ ] No Google/GitHub buttons on `/auth` (password only)
