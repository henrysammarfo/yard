# YARD — Copy-paste live demo (real URLs)

Everything below is ready to paste. Do it in order while recording.

---

## URLs (open these)

| What | Paste this |
| --- | --- |
| App home | `https://brainy-horse-649.convex.site` |
| Auth / signup | `https://brainy-horse-649.convex.site/auth` |
| Settings | `https://brainy-horse-649.convex.site/settings` |
| Materials | `https://brainy-horse-649.convex.site/materials` |
| Supplier portal | `https://brainy-horse-649.convex.site/supplier-portal` |
| Live board | `https://brainy-horse-649.convex.site/board` |
| Inbox | `https://brainy-horse-649.convex.site/inbox` |
| Activity | `https://brainy-horse-649.convex.site/activity` |
| Approvals | `https://brainy-horse-649.convex.site/approvals` |
| **Public page Firecrawl reads** | `https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html` |

That book page shows about **£51.77**. So:
- quote **40** → below page → **Matched**
- quote **99** → above page → **Counter**

---

## 1) Sign up (Owner)

Open: `https://brainy-horse-649.convex.site/auth`

| Field | Paste |
| --- | --- |
| First name | `Ama` |
| Last name | `Mensah` |
| Organization | `Demo Buyers Co` |
| Role | click **Owner** |
| Email | `yard-live-owner-22@example.com` *(change the number if used)* |
| Password | `YardDemo99!` |

Click **Create Account** → you land on Dashboard.

**Say:** “Every signup gets its own organisation. This one’s mine.”

---

## 2) Link YOUR inbox (Settings)

Open: `https://brainy-horse-649.convex.site/settings`  
Click tab **Inbox**

| Field | Paste |
| --- | --- |
| Inbox ID | `yard-allgas@agentmail.to` |

Click **Save inbox**.

Optional — tab **Yard profile**:

| Field | Paste |
| --- | --- |
| Notify email | `ops@demobuyers.co` |
| Default assignee | `Ama` |

Click **Save changes**. Leave and come back — values stay.

**Say:** “Each organisation configures its own inbox. Judges don’t share mine.”

---

## 3) Add a material (real page check)

Open: `https://brainy-horse-649.convex.site/materials`

| Field | Paste |
| --- | --- |
| Product name | `A Light in the Attic` |
| Category | `Books` |
| Buy unit | `copy` |
| Public page URL | `https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html` |

Click **Add & check price**.  
Then open Activity: `https://brainy-horse-649.convex.site/activity`  
Wait a few seconds for market price / refresh.

**Say:** “Firecrawl reads that public page for the unit price.”

---

## 4) Live quotes (Supplier portal — works in the browser)

Open: `https://brainy-horse-649.convex.site/supplier-portal`

### Quote A — MATCH (below page ~51.77)

| Field | Paste |
| --- | --- |
| Material | `A Light in the Attic` |
| Specification | `Paperback · books.toscrape` |
| Quantity | `2 copies` |
| Unit price | `40` |
| Public page URL | `https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html` |

Click **Submit for Firecrawl check**.

### Quote B — HIGH (triggers counter)

| Field | Paste |
| --- | --- |
| Material | `A Light in the Attic HIGH` |
| Specification | `Overquoted unit` |
| Quantity | `1 copy` |
| Unit price | `99.5` |
| Public page URL | `https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html` |

Click **Submit for Firecrawl check**.

**Say:** “Forty is under the page — should match. Ninety-nine is high — YARD counters.”

---

## 5) Watch the board

Open: `https://brainy-horse-649.convex.site/board`  
Refresh every ~5–10 seconds for up to ~1–2 minutes.

You want to see:
- **Matched** (the 40 quote)
- **Countered** or Review → then Countered (the 99.5 quote)

Click into a quote row → show quoted vs page price.

Then open:
- Inbox: `https://brainy-horse-649.convex.site/inbox`
- Activity: `https://brainy-horse-649.convex.site/activity`
- Approvals: `https://brainy-horse-649.convex.site/approvals` → Approve the matched one if you want a PO

**Say:** “Quoted versus page. High quote gets a counter. Full trail in Activity.”

---

## 6) Optional — real email into AgentMail

If you can send email (Gmail / any mail client):

**To:** `yard-allgas@agentmail.to`  

**Subject:**
```
Quote — A Light in the Attic @ $99.00
```

**Body (paste all):**
```
Hi,
Material: A Light in the Attic
Quantity: 5 copies
Unit price: $99.00 per copy
Page: https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html
Thanks
```

Then watch Inbox + Board on the live app.

*(Supplier portal in step 4 already proves the same spine without leaving the browser.)*

---

## 7) Buyer role (30 seconds)

1. Sign out (sidebar bottom).  
2. Open `https://brainy-horse-649.convex.site/auth` → **Create New Profile**

| Field | Paste |
| --- | --- |
| First / Last | `Kojo` / `Buyer` |
| Organization | `Buyer Demo Co` |
| Role | **Buyer** |
| Email | `yard-live-buyer-22@example.com` |
| Password | `YardDemo99!` |

Lands on **Live board** (not Settings).  
Paste `https://brainy-horse-649.convex.site/settings` → blocked for buyer.

**Say:** “Buyer home is the board. Settings stay owner-only. Role sticks.”

---

## 8) Close line

**Say:** “That’s YARD. Check the supplier’s page. Counter only when the unit price is high. Every signup gets its own private organisation. Thanks for watching.”

Stop recording.

---

## One-block cheat sheet (keep this on screen)

```
APP:     https://brainy-horse-649.convex.site
AUTH:    https://brainy-horse-649.convex.site/auth
PAGE:    https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html
INBOX:   yard-allgas@agentmail.to
PASS:    YardDemo99!

PORTAL MATCH → material: A Light in the Attic | spec: Paperback · books.toscrape | qty: 2 copies | price: 40 | url: PAGE
PORTAL HIGH  → material: A Light in the Attic HIGH | spec: Overquoted unit | qty: 1 copy | price: 99.5 | url: PAGE
```
