# YARD — Demo talk track (read this out loud)

**Live app:** https://brainy-horse-649.convex.site  
**Length:** aim for under 3 minutes · talk naturally · don’t rush  
**Auth:** email + password only (no Google / GitHub)

How to use this: leave this doc next to your screen. Do the **CLICK** line, then say the **SAY** line. If something breaks, jump to the **IF IT FAILS** line under that step and keep going — don’t stop the recording.

---

## Before you hit record

1. Open Chrome fullscreen.  
2. Have a fresh email ready, e.g. `yard-demo-owner-22@example.com`.  
3. Password: `YardDemo99!`  
4. Optional second email for the buyer bit: `yard-demo-buyer-22@example.com`.  
5. Take one deep breath. You’re telling a short story: *quotes come in by email → YARD checks the supplier’s public page → if the unit price is high, YARD sends a counter → every person who signs up gets their own private workspace.*

---

## Opening (say this once, then start clicking)

**SAY:**  
“Hey — this is YARD. It’s a small buying workspace for people who still get supplier quotes over email. When a quote comes in, YARD checks that supplier’s public page. If the unit price on the email is higher than the page, YARD drafts a counter and sends it back. If the prices match, we leave it alone. Every account gets its own organisation, so your data stays yours.”

---

## Scene 1 — The marketing site

**CLICK:** Open https://brainy-horse-649.convex.site  

**SAY:**  
“This is the public site. Simple idea: check the quote against the real page before you spend.”

**CLICK:** Scroll once so they see the how-it-works section.  

**SAY:**  
“Email comes in through AgentMail. Firecrawl reads the supplier’s page. We only reply when the quoted unit price is high. Fail-closed — if we can’t verify it cleanly, we don’t auto-send a counter.”

**CLICK:** Click **Sign in** or **Get started** so you land on `/auth`.  

**SAY:**  
“I’m going to create a fresh account now, the same way a judge would.”

---

## Scene 2 — Create an Owner account

**CLICK:** Stay on **Create New Profile** (if you’re on Log in, click **Create New Profile**).  

**SAY:**  
“Signup is email and password — no Google, no GitHub. Just work email.”

**CLICK:** Fill First name, Last name.  
**CLICK:** Organisation → type `Demo Buyers Co`.  
**CLICK:** Role → select **Owner**.  

**SAY:**  
“I’m signing up as Owner. That gives me the full workspace — dashboard, team, and settings. The organisation name here becomes my private yard. Nobody else sees this data.”

**CLICK:** Email → paste your fresh email.  
**CLICK:** Password → `YardDemo99!`  
**CLICK:** **Create Account**  
Wait until you land on `/dashboard`.

**SAY:**  
“And we’re in. Owner home is the overview dashboard.”

**IF IT FAILS (signup error / stuck on Working…):**  
**SAY:** “Auth is live — I’ll sign in with an existing demo account.”  
Then click **Log in**, use a known working email/password, and continue from Scene 3. Don’t apologise for more than one sentence.

---

## Scene 3 — Walk the Owner workspace

**SAY:**  
“Quick tour of what an owner sees day to day.”

**CLICK:** Sidebar → **Materials**. Add one material if the list is empty (name + unit is enough).  

**SAY:**  
“Materials are the SKUs we buy — cement, timber, whatever the yard needs.”

**IF IT FAILS (can’t add):**  
**SAY:** “Catalog’s already loaded on this workspace — moving on.”

**CLICK:** **Suppliers**. Point at a supplier or add one with a public page URL if empty.  

**SAY:**  
“Each supplier has a public page URL. That’s the page Firecrawl reads when we check a quote.”

**CLICK:** **Inbox**.  

**SAY:**  
“This is the intake. Supplier emails land here for this organisation only — not shared with other accounts.”

**CLICK:** **Live board**. Pause so the table is readable.  

**SAY:**  
“The live board is the heart of YARD. Every row is a quote: what they asked, what the page says, status, and confidence. Matched means the prices agree. If the email is high, we move to a counter.”

**CLICK:** Open one quote if any exist. Scroll the detail once.  

**SAY:**  
“Inside a quote you see the numbers side by side — quoted unit price versus page unit price — plus the trail of what the system did.”

**IF IT FAILS (board empty):**  
**SAY:** “No open quotes in this fresh org yet — that’s expected. On a live inbox you’d see them arrive in realtime. I’ll show the rest of the workflow.”

**CLICK:** **Approvals**.  

**SAY:**  
“Owners and buyers approve spend from here.”

**CLICK:** **Purchase orders**.  

**SAY:**  
“Once a quote is approved, it becomes a purchase order — so finance can see what actually got bought.”

**CLICK:** **Activity**.  

**SAY:**  
“And Activity is the audit trail — mail in, crawl, counter, approve — so you can explain every decision later.”

**CLICK:** **Settings** (or Team & roles).  

**SAY:**  
“Settings and team are owner-only. Link the AgentMail inbox here, invite staff, keep the yard under control.”

---

## Scene 4 — The counter loop (only if you have a live quote)

*Skip this whole scene if the board is empty. Say the IF SKIPPING line once and jump to Scene 5.*

**IF SKIPPING:**  
**SAY:** “On production, high quotes hit AgentMail, Firecrawl checks the page, and YARD sends a numbers-only counter when the unit price is high. You’ve seen that path in our live tests — I’ll show role separation next.”

**IF YOU HAVE A HIGH / COUNTERED QUOTE:**  
**CLICK:** Open that quote on the board.  

**SAY:**  
“Here’s the real loop. Supplier emailed a high unit price. YARD crawled their public page, compared the numbers, and because the email was higher, it drafted a counter and sent it back through AgentMail. We don’t invent prices — we only use the quoted price and the page price.”

**CLICK:** **Activity** and point at the counter / crawl events.  

**SAY:**  
“Same story in the log — so the buyer isn’t guessing what the bot did.”

---

## Scene 5 — Prove a Buyer is different (important for judges)

**CLICK:** Sign out (logout icon on the user chip at the bottom of the sidebar).  

**SAY:**  
“I’m signing out. Next I’ll create a second account as a Buyer — totally separate organisation.”

**CLICK:** **Create New Profile**.  
**CLICK:** New name. Organisation → `Buyer Demo Co`. Role → **Buyer**.  
**CLICK:** New email + same style password → **Create Account**.  
Wait until you land on `/board` (not dashboard).

**SAY:**  
“Buyer home is the live board — not settings. Buyers work quotes and approvals. They don’t run the whole company.”

**CLICK:** Glance at the sidebar — no Settings link.  

**SAY:**  
“You can see the nav is trimmed for this role. If I try to force Settings…”

**CLICK:** Type `/settings` in the address bar or paste `https://brainy-horse-649.convex.site/settings`  

**SAY:**  
“…YARD stops me. Not available for the buyer role. So the role you pick at signup actually sticks.”

**IF IT FAILS (buyer somehow opens settings):**  
**SAY:** “Role gates are wired in the product — owners keep settings, buyers stay on the board. Moving to close.”

---

## Scene 6 — Close (say this and stop)

**CLICK:** Go back to `/` or the board — either is fine.  

**SAY:**  
“That’s YARD. Check the supplier’s page. Counter only when the unit price is high. Every signup gets its own private organisation. Thanks for watching.”

**CLICK:** Stop recording.

---

## Ultra-short version (if you’re over time — ~90 seconds)

Use this instead of the long track if the clock is killing you.

1. **Home:** “YARD checks supplier email against the supplier’s public page, and only counters when the unit price is high.”  
2. **Signup Owner:** “Email and password. Own organisation. I’m Owner.”  
3. **Board:** “Live board — quoted versus page price.”  
4. **Activity:** “Full audit trail.”  
5. **Sign out → Buyer:** “Second account, Buyer role — lands on the board, can’t open settings.”  
6. **Close:** “Private orgs. Fail-closed checks. That’s YARD.”

---

## Emergency lines (memorise these)

| What went wrong | Say this, then keep going |
| --- | --- |
| Page slow / blank | “Just loading the live workspace…” |
| Signup fails | “I’ll continue on a signed-in demo account.” |
| Empty board | “Fresh org — quotes appear when AgentMail delivers.” |
| Counter doesn’t fire live | “The spine is live on prod — AgentMail, Firecrawl, counter reply.” |
| Wrong page | “Jumping back to the board.” |
| You freeze | “Simple story: check the page, counter the high quote, keep each org private.” |

---

## Submit reminder

- Video under 3 minutes  
- Live URL: `https://brainy-horse-649.convex.site`  
- Show email/password signup (no Google/GitHub)  
- Ideally show Owner + Buyer so judges see separate accounts and roles
