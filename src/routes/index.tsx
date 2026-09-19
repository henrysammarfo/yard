import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mail, Radar, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/yard/public-shell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "YARD — Procurement decisions, live" },
    { name: "description", content: "YARD turns supplier quote emails into live, market-checked buying decisions for Accra yards." },
    { property: "og:title", content: "YARD — Procurement decisions, live" },
    { property: "og:description", content: "Mail in. Market checked. Good buying decisions out." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Home,
});

const rows = [
  ["16mm iron rods", "Aseda Steel", "GH₵ 99.50", "GH₵ 94.25", "+5.6%", "Review"],
  ["Ghacem 42.5R", "Coastal Cement", "GH₵ 123.00", "GH₵ 126.00", "−2.4%", "Approved"],
  ["Wawa boards", "Northline", "GH₵ 190.00", "GH₵ 177.00", "+7.3%", "Needs info"],
];
function Home() { return <PublicShell><main>
  <section className="yard-hero"><div className="yard-hero__grid" aria-hidden="true"/><div className="yard-hero__copy"><span className="eyebrow"><i/>LIVE PROCUREMENT FOR ACCRA YARDS</span><h1>Know what to buy.<br/><em>Before you buy it.</em></h1><p>Supplier emails become clean quotes, checked against today’s public prices and ready for your team to approve.</p><div className="hero-actions"><Link to="/dashboard" className="button button--dark">Open live board <ArrowRight/></Link><Link to="/how-it-works" className="button button--light">See how it works</Link></div></div>
    <div className="hero-product"><div className="product-top"><span><i/> YARD LIVE BOARD</span><small>DEMO DATA · ACCRA</small></div><div className="product-flow"><div><Mail/><span>QUOTE EMAIL</span><b>09:42</b></div><ArrowRight/><div><Radar/><span>MARKET CHECK</span><b>3 sources</b></div><ArrowRight/><div><ShieldCheck/><span>DECISION</span><b>Ready</b></div></div><div className="mini-table"><div className="mini-table__head"><span>MATERIAL</span><span>SUPPLIER</span><span>QUOTED</span><span>MARKET</span><span>VARIANCE</span><span>STATUS</span></div>{rows.map((r)=><div className="mini-table__row" key={r[0]}>{r.map((c,i)=><span key={c} className={i===5?`mini-status s${r[5].replace(' ','').toLowerCase()}`:''}>{c}</span>)}</div>)}</div></div>
  </section>
  <section className="signal-strip">{["MAIL RECEIVED", "LINE ITEMS EXTRACTED", "PUBLIC PRICES CHECKED", "TEAM APPROVAL", "CONFIRMATION SENT"].map((x,i)=><span key={x}><b>{String(i+1).padStart(2,'0')}</b>{x}</span>)}</section>
  <section className="home-statement"><span className="eyebrow">ONE LIVE BUYING SYSTEM</span><h2>Not another CRM.<br/>Your yard’s <em>decision layer.</em></h2><div className="statement-copy"><p>Every quote stays tied to its source email, current public evidence, assignee, and final decision.</p><Link to="/projects">Explore the workflows <ArrowRight/></Link></div></section>
  <section className="home-steps">{[["01","MAIL","Suppliers keep using email. YARD reads the message and attachments."],["02","CHECK","Public sources refresh the benchmark behind every recommendation."],["03","DECIDE","Owners and buyers approve with the full record in one place."]].map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p><Check/></article>)}</section>
</main></PublicShell> }
