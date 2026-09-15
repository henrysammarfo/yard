# YARD full product and brand

## Outcome
Transform the current Alwayzz template into **YARD**, a polished hybrid procurement product for Accra yards. The experience will demonstrate the complete email-to-price-to-approval loop with realistic seeded data, while keeping integration points ready for Convex, Firecrawl, and AgentMail.

## Brand system
- Create an original industrial-stamp identity: bold **YARD** wordmark, compact yard-mark emblem, monochrome primary lockup, and rust-red/sage accents.
- Make the logo reproducible as clean vector artwork for the website, hoodies, labels, stamps, and future merchandise.
- Extend the current minimal template language with Bebas Neue headings, Barlow body copy, tight spacing, crisp rules, restrained motion, and premium Lucide icons.
- Replace all Alwayzz names, agency imagery, claims, and decorative elements with YARD-specific material and procurement visuals.

## Public website
- **Home:** product-led visual demonstration of email → live quote → public price comparison → approval, with clear calls to action.
- **How it works:** detailed three-step workflow, supported materials, approval logic, and outbound confirmation.
- **About:** Accra-first story, product principles, and team identity from the brief.
- **Contact:** usable inquiry/demo form with success state.
- **Sign in:** role-aware demo entry for owner, staff/buyer, and supplier.
- **Trust:** Security, Privacy, and Terms pages with appropriately framed demo-stage language.
- **Hackathon:** public build log, sponsor architecture, deadline/evidence checklist, GitHub/social links, and demo-video placeholder.
- **Help center:** searchable-looking guide index, FAQs, onboarding, and support entry points.

## Product routes and flows
- **Owner dashboard:** daily overview, urgent decisions, live activity, spend, savings, supplier health, and team workload.
- **Inbox:** quote-email list, parsed email detail, attachment state, extraction confidence, and processing timeline.
- **Live board:** dense procurement table with material, quantity, quoted price, public benchmark, variance, freshness, status, and assignee.
- **Quote detail:** source email, extracted line items, Firecrawl comparison evidence, notes, audit trail, and approve/reject/request-change actions.
- **Approvals:** queue, bulk selection, confirmation dialog, and visible success state.
- **Suppliers:** directory, scorecards, history, contact detail, and supplier-specific quote performance.
- **Materials and market prices:** tracked materials, fresh/stale indicators, sources, and price history visualization.
- **Purchase orders:** approved items, order detail, fulfillment status, and downloadable-looking records.
- **Activity:** immutable-looking operational timeline covering mail, crawl, assignment, approval, and reply events.
- **Team and roles:** owner, staff, buyer, and supplier access views; assignments and permissions UI.
- **Settings and integrations:** yard profile, inbox address, notification preferences, Convex/Firecrawl/AgentMail connection states, and demo/live mode.
- **Supplier portal:** supplier overview, requests, quote submission, quote history, and status tracking.
- Add purposeful empty, loading, error, stale-data, confirmation, and success states to the main flows.

## Interaction model
- Use realistic local demo data and browser state so filtering, searching, status changes, approvals, assignments, forms, and navigation work in the preview.
- Clearly label simulated integration results and preserve a visible demo/live mode distinction.
- Use role switching for the prototype rather than real authentication in this hybrid phase.
- Ensure every navigation item has a real route and every major action leads to a complete state or destination.

## Technical details
- Keep TanStack Start, React 19, Tailwind v4, and the existing reusable UI controls.
- Use semantic design tokens in `src/styles.css`; avoid raw color styling in page code.
- Build shared public navigation, dashboard shell, role switcher, data tables, status treatments, charts, dialogs, and forms as focused components.
- Give every public content route unique title, description, Open Graph title/description, Open Graph type, and Twitter card metadata.
- Keep protected-looking dashboard routes demo-accessible for now; no real credentials or live sponsor calls will be implied.
- Verify core owner, buyer, and supplier journeys on desktop and mobile, including menu behavior and key state changes.

## Scope boundary
This phase delivers a complete, navigable, high-fidelity hybrid demo. Real inbox ingestion, live crawling, persistent accounts, and production permissions require connecting the named external services and a persistent backend in a later integration phase.
