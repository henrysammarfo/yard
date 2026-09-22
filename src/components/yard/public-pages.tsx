import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PublicShell, PageIntro } from "./public-shell";
import { roleProfiles, useSession, type Role } from "@/lib/yard-session";
import { Check, CircleHelp, Mail, Search, ShieldCheck, Users } from "lucide-react";

const workflows = [
  {
    n: "01",
    title: "Email intake",
    copy: "Supplier quotes arrive by email. AgentMail webhooks create a live quote row in Convex.",
    meta: "AgentMail",
  },
  {
    n: "02",
    title: "Public page check",
    copy: "Firecrawl extracts the unit price from the supplier’s own public page. Extract fail stays amber — no mail.",
    meta: "Firecrawl",
  },
  {
    n: "03",
    title: "Counter or pass",
    copy: "If quoted is higher than the page, YARD drafts a counter from those numbers only and AgentMail replies.",
    meta: "OpenAI-compatible draft",
  },
];

export function ProjectsPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="PROJECTS"
        title="The buying work, connected."
        copy="Explore the operational workflows YARD turns into one clear, accountable system."
      />
      <section className="project-list">
        {workflows.map((w) => (
          <article key={w.n}>
            <span>{w.n}</span>
            <div>
              <small>{w.meta}</small>
              <h2>{w.title}</h2>
              <p>{w.copy}</p>
              <Link to="/dashboard">
                View in dashboard <ArrowRight />
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
      title: "For one active yard",
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
      title: "For multi-yard teams",
      price: "LET’S TALK",
      detail: "Custom yards · controls · onboarding",
    },
  ];
  return (
    <PublicShell>
      <PageIntro
        eyebrow="PLANS"
        title="Start with the yard you run today."
        copy="Simple plans built around quote volume, team size, and buying oversight."
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
        copy="YARD is built where materials move — for everyday buyers who still price jobs from supplier email."
      />
      <section className="team-feature">
        <div className="team-monogram">HM</div>
        <div>
          <span>FOUNDER & BUILDER</span>
          <h2>Henry Sam Marfo</h2>
          <p>Product direction and systems — useful software that fits work people already do.</p>
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
          <p>US / EU / APAC builders and yard buyers — Accra is where it’s built, not the ICP.</p>
        </article>
        <article>
          <ShieldCheck />
          <h3>Fail-closed evidence</h3>
          <p>No page price, no counter. The LLM never invents a unit price.</p>
        </article>
        <article>
          <Check />
          <h3>Everyday useful</h3>
          <p>One emailed price vs one public page — then a live row.</p>
        </article>
      </section>
    </PublicShell>
  );
}

export function FaqsPage() {
  const qs: [string, string][] = [
    [
      "Does YARD replace supplier email?",
      "No. Suppliers keep emailing. YARD turns those messages into checked decisions and replies when needed.",
    ],
    [
      "What if the page price cannot be extracted?",
      "The quote stays amber and no outbound mail is sent. Fail-closed by design.",
    ],
    [
      "Can several staff review a quote?",
      "Yes. Quotes can be assigned, reviewed, approved, rejected, or sent back for more information.",
    ],
    [
      "Is this connected to live services?",
      "Yes. AgentMail, Firecrawl, and Convex power the live loop. LLM draft uses Convex AI Gateway or AgentRouter from the server.",
    ],
  ];
  return (
    <PublicShell>
      <PageIntro
        eyebrow="FAQs"
        title="Clear answers, before you commit."
        copy="How YARD handles suppliers, prices, approvals, and live operations."
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
        copy="Tell us how you receive quotes today. We’ll show the YARD loop."
      />
      <section className="contact-layout">
        <aside>
          <h2>Demo enquiries</h2>
          <p>Product demos and pilot conversations are open.</p>
          <span className="contact-note">
            <Mail /> Use the form — messages persist in Convex.
          </span>
        </aside>
        {sent ? (
          <div className="form-success">
            <Check />
            <h2>Message received.</h2>
            <p>Thanks. We’ll get back to you shortly.</p>
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
              Yard or company
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
        title="Eight seconds from email to evidence."
        copy="A fail-closed loop where every system changes the live buying state."
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
        copy="YARD checks a supplier quote against that supplier’s public page — then replies only when the quote is high."
      />
      <section className="prose-band">
        <h2>Everyday usefulness over software theatre.</h2>
        <p>
          Prices move. Quotes arrive messy. YARD creates a live, legible record without asking
          suppliers to learn a new system.
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
        copy="Guides for inbox setup, quote review, market evidence, approvals, and supplier replies."
      />
      <section className="help-search">
        <Search />
        <input aria-label="Search help" placeholder="Search guides" />
      </section>
      <section className="principles">
        {[
          "Getting started",
          "Reviewing a quote",
          "Managing approvals",
          "Supplier access",
          "Market evidence",
          "Account & settings",
        ].map((x) => (
          <article key={x}>
            <CircleHelp />
            <h3>{x}</h3>
            <p>Step-by-step guidance for your YARD workspace.</p>
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
        copy="Mail → Firecrawl page price → counter only on high quotes → live Convex board."
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
    Terms: "The terms governing use of YARD.",
  }[kind];
  return (
    <PublicShell>
      <PageIntro eyebrow="TRUST CENTRE" title={kind} copy={copy} />
      <section className="legal-copy">
        <p>Last updated 22 September 2026</p>
        <h2>Production posture</h2>
        <p>
          Org-scoped data, Convex Auth sessions (no localStorage), signed AgentMail webhooks, and
          secrets held in Convex environment variables.
        </p>
        <h2>Fail-closed pricing</h2>
        <p>
          If a public unit price cannot be extracted, the quote stays amber and no counter is sent.
        </p>
      </section>
    </PublicShell>
  );
}

export function AuthPage() {
  const { signIn } = useAuthActions();
  const bootstrap = useMutation(api.organizations.bootstrap);
  const session = useSession();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const [mode, setMode] = useState<"signIn" | "signUp">("signUp");
  const [role, setRole] = useState<Role>("owner");
  const [orgName, setOrgName] = useState("YARD Buyers Co");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session) return;
    const dest =
      search.redirect && search.redirect.startsWith("/")
        ? search.redirect
        : roleProfiles[session.role].home;
    void navigate({ to: dest });
  }, [session, navigate, search.redirect]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("email", email.trim().toLowerCase());
      form.set("password", password);
      form.set("flow", mode);
      if (mode === "signUp") form.set("name", name || email.split("@")[0] || "Member");
      await signIn("password", form);
      if (mode === "signUp") {
        await bootstrap({ orgName: orgName.trim() || "YARD Org", role });
      } else {
        // Existing users may still need an org on first login after schema cutover
        try {
          await bootstrap({ orgName: orgName.trim() || "YARD Org", role });
        } catch {
          /* already has membership */
        }
      }
      const dest =
        search.redirect && search.redirect.startsWith("/")
          ? search.redirect
          : roleProfiles[role].home;
      void navigate({ to: dest });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PublicShell>
      <section className="auth-page">
        <div>
          <span className="eyebrow">SECURE WORKSPACE</span>
          <h1>Sign in to YARD.</h1>
          <p>
            Convex Auth sessions — no localStorage. Pick your role when you create the workspace,
            then return to the page you came from.
          </p>
        </div>
        <form className="auth-form" onSubmit={(e) => void onSubmit(e)}>
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "signUp" ? "is-active" : ""}
              onClick={() => setMode("signUp")}
            >
              Create account
            </button>
            <button
              type="button"
              className={mode === "signIn" ? "is-active" : ""}
              onClick={() => setMode("signIn")}
            >
              Sign in
            </button>
          </div>
          {mode === "signUp" && (
            <>
              <label>
                Your name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ama Buyer"
                />
              </label>
              <label>
                Organization
                <input required value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </label>
              <fieldset className="role-fieldset">
                <legend>Role</legend>
                {(Object.keys(roleProfiles) as Role[]).map((r) => (
                  <label key={r} className={role === r ? "is-active" : ""}>
                    <input
                      type="radio"
                      name="role"
                      checked={role === r}
                      onChange={() => setRole(r)}
                    />
                    <span>
                      <strong>{roleProfiles[r].label}</strong>
                      <small>{roleProfiles[r].copy}</small>
                    </span>
                  </label>
                ))}
              </fieldset>
            </>
          )}
          <label>
            Work email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signUp" ? "new-password" : "current-password"}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" disabled={busy}>
            {busy ? "Working…" : mode === "signUp" ? "Create workspace" : "Sign in"} <ArrowRight />
          </Button>
        </form>
      </section>
    </PublicShell>
  );
}
