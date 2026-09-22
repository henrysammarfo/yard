import { useMutation } from "convex/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PublicShell, PageIntro } from "./public-shell";
import { Check, CircleHelp, Mail, Search, ShieldCheck, Users } from "lucide-react";
export { AuroraAuthPage as AuthPage } from "./aurora-auth";

const workflows = [
  {
    n: "01",
    title: "Email intake",
    copy: "Supplier quotes still arrive by email. AgentMail delivers each message into Convex as a live quote row your team can act on.",
    meta: "AgentMail",
  },
  {
    n: "02",
    title: "Public page check",
    copy: "Firecrawl reads the unit price from the supplier’s own public page. If extraction fails, the quote stays amber and no email goes out.",
    meta: "Firecrawl",
  },
  {
    n: "03",
    title: "Counter or pass",
    copy: "When the quoted unit price is higher than the page price, YARD drafts a counter from those numbers only—and AgentMail sends the reply.",
    meta: "OpenAI-compatible draft",
  },
];

export function ProjectsPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="PROJECTS"
        title="The buying work, connected."
        copy="Three workflows that turn messy supplier email into a clear, accountable buying record."
      />
      <section className="project-list">
        {workflows.map((w) => (
          <article key={w.n}>
            <span>{w.n}</span>
            <div>
              <small>{w.meta}</small>
              <h2>{w.title}</h2>
              <p>{w.copy}</p>
              <Link to="/auth">
                Open the workspace <ArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}

export function PlansPage() {
  const plans = [
    {
      name: "SITE",
      title: "For one active buying team",
      price: "$49",
      detail: "1 inbox · 5 teammates · 250 quotes/mo",
    },
    {
      name: "GROUP",
      title: "For growing operations",
      price: "$129",
      detail: "3 inboxes · 20 teammates · 1,000 quotes/mo",
    },
    {
      name: "NETWORK",
      title: "For multi-site teams",
      price: "LET’S TALK",
      detail: "Custom inboxes · controls · onboarding",
    },
  ];
  return (
    <PublicShell>
      <PageIntro
        eyebrow="PLANS"
        title="Start with the team you run today."
        copy="Simple pricing based on quote volume, teammate seats, and buying oversight—not feature theatre."
      />
      <section className="plans-grid">
        {plans.map((p, i) => (
          <article className={i === 1 ? "is-featured" : ""} key={p.name}>
            <span>{p.name}</span>
            <h2>{p.title}</h2>
            <strong>{p.price}</strong>
            <small>{i < 2 ? "per month" : "tailored to your operation"}</small>
            <p>{p.detail}</p>
            <Link to="/contact" className="button button--dark">
              Choose {p.name.toLowerCase()} <ArrowRight />
            </Link>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}

export function TeamPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="TEAM"
        title="Built close to the work."
        copy="YARD is for everyday buyers who still price jobs from supplier email—and need a fail-closed check before they spend."
      />
      <section className="team-feature">
        <div className="team-monogram">HM</div>
        <div>
          <span>FOUNDER & BUILDER</span>
          <h2>Henry Sam Marfo</h2>
          <p>
            Product direction and systems engineering—software that fits the work people already do,
            not a new ritual they have to learn.
          </p>
          <div className="team-links">
            <a href="https://x.com/henrysammarfo" target="_blank" rel="noreferrer">
              @henrysammarfo
            </a>
            <a href="https://github.com/henrysammarfo" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </section>
      <section className="principles">
        <article>
          <Users />
          <h3>Buyer first</h3>
          <p>
            Built for builders and yard buyers worldwide. We build from Accra; the product serves
            any team that buys by email.
          </p>
        </article>
        <article>
          <ShieldCheck />
          <h3>Fail-closed evidence</h3>
          <p>No public page price, no counter. The model never invents a unit price.</p>
        </article>
        <article>
          <Check />
          <h3>Everyday useful</h3>
          <p>One emailed quote versus one public page—then a live row your team can approve.</p>
        </article>
      </section>
    </PublicShell>
  );
}

export function FaqsPage() {
  const qs: [string, string][] = [
    [
      "Does YARD replace supplier email?",
      "No. Suppliers keep emailing as they do today. YARD turns those messages into checked decisions and only replies when a counter is justified.",
    ],
    [
      "What if the page price cannot be extracted?",
      "The quote stays amber and no outbound mail is sent. That fail-closed rule is intentional—never guess a unit price.",
    ],
    [
      "Can several people review a quote?",
      "Yes. Quotes can be assigned, reviewed, approved, rejected, or sent back for more information.",
    ],
    [
      "Is this connected to live services?",
      "Yes. AgentMail, Firecrawl, and Convex power the live loop. Draft replies use an OpenAI-compatible model from the server—never from the browser.",
    ],
  ];
  return (
    <PublicShell>
      <PageIntro
        eyebrow="FAQs"
        title="Clear answers before you commit."
        copy="How YARD handles suppliers, prices, approvals, and the live services behind the board."
      />
      <section className="faq-list">
        {qs.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {q}
              <b>+</b>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </PublicShell>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitContact = useMutation(api.catalog.submitContact);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await submitContact({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        message: `${String(fd.get("company") ?? "")}\n${String(fd.get("message") ?? "")}`.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send");
    }
  }
  return (
    <PublicShell>
      <PageIntro
        eyebrow="GET IN TOUCH"
        title="Bring us your busiest buying day."
        copy="Tell us how quotes arrive today. We will walk you through the YARD loop on your own inbox."
      />
      <section className="contact-layout">
        <aside>
          <h2>Demo enquiries</h2>
          <p>Product demos and short pilot conversations are open.</p>
          <span className="contact-note">
            <Mail /> Use the form—messages are stored securely in Convex.
          </span>
        </aside>
        {sent ? (
          <div className="form-success">
            <Check />
            <h2>Message received.</h2>
            <p>Thanks. We will get back to you shortly.</p>
            <Button onClick={() => setSent(false)} variant="outline">
              Send another
            </Button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={(e) => void submit(e)}>
            <label>
              Name
              <input required name="name" placeholder="Your name" />
            </label>
            <label>
              Work email
              <input required type="email" name="email" placeholder="you@company.com" />
            </label>
            <label>
              Company
              <input name="company" placeholder="Business name" />
            </label>
            <label>
              What should we know?
              <textarea
                required
                rows={5}
                name="message"
                placeholder="Tell us about your quote workflow"
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <Button type="submit">
              Send enquiry <ArrowRight />
            </Button>
          </form>
        )}
      </section>
    </PublicShell>
  );
}

export function HowItWorksPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="HOW IT WORKS"
        title="From inbox to evidence—fail-closed."
        copy="Three live systems update the buying state together. If the page price cannot be proven, nothing ships."
      />
      <section className="project-list">
        {workflows.map((w) => (
          <article key={w.n}>
            <span>{w.n}</span>
            <div>
              <small>{w.meta}</small>
              <h2>{w.title}</h2>
              <p>{w.copy}</p>
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}

export function AboutPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="ABOUT YARD"
        title="Built for people who still buy from email."
        copy="YARD checks a supplier quote against that supplier’s public page, then replies only when the quoted unit price is high."
      />
      <section className="prose-band">
        <h2>Everyday usefulness over software theatre.</h2>
        <p>
          Prices move. Quotes arrive messy. YARD keeps a live, legible record without asking
          suppliers to learn a new system—or asking buyers to trust a guessed number.
        </p>
      </section>
    </PublicShell>
  );
}

export function HelpPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="HELP CENTRE"
        title="Find your next step."
        copy="Short guides for inbox setup, quote review, market evidence, approvals, and supplier replies."
      />
      <section className="help-search">
        <Search />
        <input aria-label="Search help" placeholder="Search guides" />
      </section>
      <section className="principles">
        {[
          ["Getting started", "Create your workspace, invite teammates, and connect AgentMail."],
          ["Reviewing a quote", "Read the email, the page price, and the amber or green status."],
          ["Managing approvals", "Assign owners, approve spend, or send a quote back for clarity."],
          ["Supplier access", "Give suppliers a portal without changing how they email you."],
          ["Market evidence", "See how Firecrawl grounds every counter in a public unit price."],
          ["Account & settings", "Inbox ID, roles, and integration readiness for your organisation."],
        ].map(([title, body]) => (
          <article key={title}>
            <CircleHelp />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}

export function HackathonPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="CONVEX ALL GAS · BUILD LOG"
        title="The proof is in the live loop."
        copy="Mail in, Firecrawl page price, counter only when the quote is high, live Convex board out."
      />
      <section className="hack-grid">
        <article>
          <span>ARCHITECTURE</span>
          <h2>AgentMail → Convex → Firecrawl → draft → reply</h2>
        </article>
        <article>
          <span>SUBMISSION SPINE</span>
          <ul>
            <li>
              <Check /> Live convex.site experience
            </li>
            <li>
              <Check /> Public hackathon.md log
            </li>
            <li>
              <Check /> Open GitHub repository
            </li>
            <li>
              <Check /> Three-minute demo video
            </li>
          </ul>
        </article>
      </section>
    </PublicShell>
  );
}

export function LegalPage({ kind }: { kind: "Security" | "Privacy" | "Terms" }) {
  const copy = {
    Security: "How we protect workspace access, supplier records, and approvals.",
    Privacy: "How YARD handles account, supplier, and quote information.",
    Terms: "The terms that govern use of the YARD workspace.",
  }[kind];
  return (
    <PublicShell>
      <PageIntro eyebrow="TRUST CENTRE" title={kind} copy={copy} />
      <section className="legal-copy">
        <p>Last updated 22 September 2026</p>
        <h2>Production posture</h2>
        <p>
          Data is scoped by organisation. Sessions use Convex Auth (not localStorage). AgentMail
          webhooks are signature-verified. API secrets stay in Convex environment variables.
        </p>
        <h2>Fail-closed pricing</h2>
        <p>
          If a public unit price cannot be extracted, the quote stays amber and no counter email is
          sent.
        </p>
        {kind === "Privacy" && (
          <>
            <h2>What we store</h2>
            <p>
              Account identity, organisation membership, supplier and quote records, and messages
              needed to run the buying loop. Contact-form enquiries are stored so we can reply.
            </p>
          </>
        )}
        {kind === "Terms" && (
          <>
            <h2>Acceptable use</h2>
            <p>
              Use YARD for legitimate procurement workflows. Do not attempt to bypass organisation
              boundaries, abuse inbound mail, or rely on YARD as a substitute for legal advice.
            </p>
          </>
        )}
      </section>
    </PublicShell>
  );
}
