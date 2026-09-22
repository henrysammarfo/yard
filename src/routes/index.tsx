import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PublicShell } from "@/components/yard/public-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YARD — Procurement decisions, live" },
      {
        name: "description",
        content:
          "YARD turns supplier quote emails into live, market-checked buying decisions for Accra yards.",
      },
      { property: "og:title", content: "YARD — Procurement decisions, live" },
      {
        property: "og:description",
        content: "Mail in. Market checked. Good buying decisions out.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ticker = [
  "Supplier Email",
  "Quote Extraction",
  "Market Check",
  "Live Board",
  "Team Approval",
];
function CurveLines({ position }: { position: "left" | "right" | "top" }) {
  return (
    <div className={`curve-lines curve-lines--${position}`} aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => (
        <span className={`curve-line curve-line--${i + 1}`} key={i} />
      ))}
    </div>
  );
}
function Home() {
  return (
    <PublicShell>
      <main>
        <section className="hero yard-template-hero">
          <CurveLines position="left" />
          <CurveLines position="right" />
          <CurveLines position="top" />
          <div className="hero__content">
            <div className="service-ticker" aria-label="YARD workflow">
              <div className="service-ticker__track">
                {Array.from({ length: 4 }, () => ticker)
                  .flat()
                  .map((item, i) => (
                    <span className="service-ticker__item" key={`${item}-${i}`}>
                      {item}
                    </span>
                  ))}
              </div>
            </div>
            <h1 className="hero__title">
              Quote control <span className="hero__serif">YARD</span>
              <sup>®</sup> in control.
            </h1>
            <p className="hero__subtitle">
              A supplier emails a price. YARD checks their public page and writes back before you
              buy — live.
            </p>
            <div className="hero__actions">
              <Link className="primary-cta" to="/dashboard">
                Open Live Board
              </Link>
              <Link className="book-cta" to="/contact">
                <span className="yard-avatar">HM</span>
                <span className="book-cta__copy">
                  <strong>Chat for 15 minutes</strong>
                  <span className="book-cta__slot">
                    <i />
                    Pick a slot
                  </span>
                </span>
              </Link>
            </div>
          </div>
          <div className="hero__blur" aria-hidden="true" />
        </section>
        <section className="trusted">
          <div className="trusted__inner">
            <p className="trusted__label">The complete quote-to-decision loop</p>
            <div className="partner-marquee">
              <div className="partner-marquee__track">
                {[...ticker, ...ticker, ...ticker, ...ticker].map((x, i) => (
                  <span className="partner-logo" key={`${x}-${i}`}>
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="signal-strip">
          {[
            "MAIL RECEIVED",
            "LINE ITEMS EXTRACTED",
            "PUBLIC PRICES CHECKED",
            "TEAM APPROVAL",
            "CONFIRMATION SENT",
          ].map((x, i) => (
            <span key={x}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {x}
            </span>
          ))}
        </section>
        <section className="home-statement">
          <span className="eyebrow">ONE LIVE BUYING SYSTEM</span>
          <h2>
            Not another CRM.
            <br />
            Your yard’s <em>decision layer.</em>
          </h2>
          <div className="statement-copy">
            <p>
              Every quote stays tied to its source email, current public evidence, assignee, and
              final decision.
            </p>
            <Link to="/projects">
              Explore the workflows <ArrowRight />
            </Link>
          </div>
        </section>
        <section className="home-steps">
          {[
            ["01", "MAIL", "Suppliers keep using email. YARD reads the message and attachments."],
            ["02", "CHECK", "Public sources refresh the benchmark behind every recommendation."],
            ["03", "DECIDE", "Owners and buyers approve with the full record in one place."],
          ].map(([n, t, c]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{c}</p>
              <Check />
            </article>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
