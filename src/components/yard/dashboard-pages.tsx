import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleDollarSign, Clock3, Inbox, Mail, PackageCheck, Plus, RefreshCw, Search, Send, TrendingDown, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { materials, suppliers, type Quote, type QuoteStatus } from "@/lib/yard-data";
import { roleProfiles, useSession } from "@/lib/yard-session";
import { assignQuote, refreshMarket, resetWorkspace, setOrderStatus, setQuoteStatus, submitSupplierQuote, useYard } from "@/lib/yard-store";
import { DashboardShell, Metric, Status } from "./dashboard-shell";

const money = (n: number) => `GH₵ ${n.toLocaleString()}`;
const variance = (q: Quote) => ((q.quoted - q.market) / q.market) * 100;

function QuoteTable({ data }: { data: Quote[] }) {
  if (data.length === 0) return <div className="empty-state"><Search /><h3>No quotes match this view.</h3><p>Clear the search or choose another filter to see live quotes again.</p></div>;
  return <div className="data-table-wrap"><table className="data-table">
    <thead><tr><th>Quote</th><th>Material</th><th>Supplier</th><th>Quoted</th><th>Market</th><th>Variance</th><th>Owner</th><th>Status</th><th /></tr></thead>
    <tbody>{data.map((q) => { const v = variance(q); return <tr key={q.id}>
      <td><Link to="/quotes/$id" params={{ id: q.id }}>{q.id}</Link></td>
      <td><strong>{q.material}</strong><small>{q.quantity}</small></td>
      <td>{q.supplier}</td>
      <td>{money(q.quoted)}</td>
      <td>{money(q.market)}<small>{q.fresh} fresh</small></td>
      <td className={v > 0 ? "variance-up" : "variance-down"}>{v > 0 ? "+" : ""}{v.toFixed(1)}%</td>
      <td>{q.assignee}</td>
      <td><Status>{q.status}</Status></td>
      <td><Link to="/quotes/$id" params={{ id: q.id }} aria-label={`Open ${q.id}`}><ArrowRight /></Link></td>
    </tr>; })}</tbody>
  </table></div>;
}

export function DashboardPage() {
  const { quotes, orders, activity } = useYard();
  const review = quotes.filter((q) => q.status === "Review");
  const approved = quotes.filter((q) => q.status === "Approved");
  const saved = approved.reduce((sum, q) => sum + Math.max(0, q.market - q.quoted), 0);
  return <DashboardShell title="Good morning, Henry." eyebrow="OWNER WORKSPACE">
    <div className="metrics-grid">
      <Metric label="Quotes in play" value={String(quotes.length)} note={`${review.length} awaiting a decision`} icon={Inbox} />
      <Metric label="Approved value" value={money(approved.reduce((s, q) => s + q.quoted, 0))} note={`Across ${orders.length} purchase orders`} icon={CircleDollarSign} />
      <Metric label="Avoided overspend" value={money(saved)} note="Measured against public market prices" icon={TrendingDown} />
      <Metric label="Avg. decision time" value="24 min" note="12 min faster this week" icon={Clock3} />
    </div>
    <section className="dash-grid">
      <article className="dash-panel dash-panel--wide">
        <div className="panel-head"><div><span>URGENT DECISIONS</span><h2>Quotes needing eyes</h2></div><Link to="/approvals">View all <ArrowRight /></Link></div>
        <QuoteTable data={review.slice(0, 3)} />
      </article>
      <article className="dash-panel">
        <div className="panel-head"><div><span>LIVE ACTIVITY</span><h2>Today</h2></div><Activity /></div>
        <div className="activity-list">{activity.slice(0, 5).map((a, i) => <div key={a.time + a.title + i}><time>{a.time}</time><span><strong>{a.title}</strong><small>{a.detail}</small></span></div>)}</div>
        <Link className="panel-link" to="/activity">Full activity <ArrowRight /></Link>
      </article>
    </section>
  </DashboardShell>;
}

const filters = ["All", "Review", "Approved", "Needs info", "Rejected"] as const;

export function BoardPage() {
  const { quotes } = useYard();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const data = useMemo(() => quotes.filter((q) => (filter === "All" || q.status === filter) && (q.material + q.supplier + q.id).toLowerCase().includes(query.toLowerCase())), [quotes, query, filter]);
  return <DashboardShell title="Live board" eyebrow="PROCUREMENT">
    <div className="toolbar">
      <label><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search quotes, materials, suppliers" /></label>
      <div>{filters.map((f) => <button key={f} type="button" className={`filter${filter === f ? " is-active" : ""}`} onClick={() => setFilter(f)}>{f} {f === "All" ? quotes.length : quotes.filter((q) => q.status === f).length}</button>)}</div>
    </div>
    <QuoteTable data={data} />
  </DashboardShell>;
}

export function InboxPage() {
  const { quotes } = useYard();
  const [selectedId, setSelectedId] = useState(quotes[0]!.id);
  const selected = quotes.find((q) => q.id === selectedId) ?? quotes[0]!;
  return <DashboardShell title="Inbox" eyebrow="MAIL INTAKE">
    <div className="inbox-layout">
      <aside>{quotes.map((q) => <button key={q.id} type="button" className={selected.id === q.id ? "is-active" : ""} onClick={() => setSelectedId(q.id)}>
        <span><b>{q.initials}</b><strong>{q.supplier}</strong><time>{q.received}</time></span>
        <h3>Quote: {q.material}</h3><p>{q.quantity} · attached quotation</p>
      </button>)}</aside>
      <article className="mail-view">
        <div className="mail-head"><div><span className="supplier-avatar">{selected.initials}</span><div><h2>{selected.supplier}</h2><p>quotes@{selected.supplier.toLowerCase().replaceAll(" ", "").replaceAll(".", "")}.com</p></div></div><Status>{selected.status}</Status></div>
        <h1>Quotation for {selected.material}</h1>
        <p>Dear Adom Yard team, please find our current quotation for the requested materials attached. Prices are valid for seven days.</p>
        <div className="attachment"><Mail /><span><strong>{selected.id}_quotation.pdf</strong><small>2 pages · parsed successfully</small></span><b>{selected.confidence}% confidence</b></div>
        <div className="parsed-box"><span>EXTRACTED LINE ITEM</span><h3>{selected.material}</h3><p>{selected.specification} · {selected.quantity}</p><strong>{money(selected.quoted)}</strong></div>
        <Link className="button button--dark" to="/quotes/$id" params={{ id: selected.id }}>Open quote <ArrowRight /></Link>
      </article>
    </div>
  </DashboardShell>;
}

export function ApprovalsPage() {
  const { quotes } = useYard();
  const session = useSession();
  const [confirm, setConfirm] = useState<{ id: string; action: QuoteStatus } | null>(null);
  const pending = quotes.filter((q) => q.status === "Review" || q.status === "Needs info");
  const actor = session?.name.split(" ")[0] ?? "Henry";
  return <DashboardShell title="Approvals" eyebrow="DECISIONS">
    <section className="dash-panel">
      <div className="panel-head"><div><span>DECISION QUEUE</span><h2>{pending.length} awaiting approval</h2></div>
        {pending.length > 0 && <Button variant="outline" onClick={() => pending.forEach((q) => setQuoteStatus(q.id, "Approved", actor))}><Check /> Approve all</Button>}
      </div>
      {pending.length === 0 ? <div className="empty-state"><Check /><h3>Queue clear.</h3><p>Every quote has a decision. New supplier mail lands here automatically.</p></div> : <div className="approval-list">{pending.map((q) => <article key={q.id}>
        <div><span>{q.id}</span><h3>{q.material}</h3><p>{q.supplier} · {q.quantity}</p></div>
        <div><small>QUOTED</small><strong>{money(q.quoted)}</strong></div>
        <div><small>VS MARKET</small><strong className={q.quoted > q.market ? "variance-up" : "variance-down"}>{variance(q).toFixed(1)}%</strong></div>
        <div className="approval-actions">
          <Button onClick={() => setConfirm({ id: q.id, action: "Approved" })}><Check /> Approve</Button>
          <Button variant="outline" onClick={() => setConfirm({ id: q.id, action: "Rejected" })}><X /> Reject</Button>
        </div>
      </article>)}</div>}
    </section>
    {confirm && <div className="dialog-scrim" role="dialog" aria-modal="true">
      <div className="dialog">
        <h2>{confirm.action === "Approved" ? "Approve this quote?" : "Reject this quote?"}</h2>
        <p>{confirm.action === "Approved" ? "A purchase order is created and a confirmation reply is queued to the supplier." : "The supplier is told the quote was not accepted. Nothing is ordered."} Demo mode: no live mail is sent.</p>
        <div className="dialog__actions">
          <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
          <Button onClick={() => { setQuoteStatus(confirm.id, confirm.action, actor); setConfirm(null); }}>Confirm</Button>
        </div>
      </div>
    </div>}
  </DashboardShell>;
}

export function SuppliersPage() {
  const [query, setQuery] = useState("");
  const data = suppliers.filter((s) => (s.name + s.category).toLowerCase().includes(query.toLowerCase()));
  return <DashboardShell title="Suppliers" eyebrow="NETWORK">
    <div className="toolbar"><label><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers" /></label><Button><Plus /> Add supplier</Button></div>
    {data.length === 0 ? <div className="empty-state"><Search /><h3>No supplier found.</h3><p>Try a different name or material category.</p></div> : <div className="supplier-grid">{data.map((s) => <Link to="/suppliers/$id" params={{ id: s.id }} key={s.id}>
      <div className="score">{s.score}</div><Status tone={s.status.toLowerCase()}>{s.status}</Status><h2>{s.name}</h2><p>{s.category}</p>
      <dl><div><dt>Quotes</dt><dd>{s.quotes}</dd></div><div><dt>Win rate</dt><dd>{s.winRate}</dd></div><div><dt>Response</dt><dd>{s.response}</dd></div><div><dt>Spend</dt><dd>{s.spend}</dd></div></dl>
    </Link>)}</div>}
  </DashboardShell>;
}

export function MaterialsPage() {
  const [refreshed, setRefreshed] = useState<string | null>(null);
  return <DashboardShell title="Market prices" eyebrow="PUBLIC EVIDENCE">
    <div className="market-grid">{materials.map((m) => <article key={m.name}>
      <div><span>{m.category}</span><small>{m.freshness} ago</small></div>
      <h2>{m.name}</h2><strong>{m.price}</strong><p>{m.unit}</p>
      <div className={m.direction === "up" ? "variance-up" : "variance-down"}>{m.direction === "up" ? <ArrowUpRight /> : <ArrowDownRight />}{m.change} this week</div>
      <footer>{m.source} · Public market check</footer>
      <Button variant="outline" onClick={() => { refreshMarket(m.name); setRefreshed(m.name); }}><RefreshCw /> {refreshed === m.name ? "Checked just now" : "Re-check price"}</Button>
    </article>)}</div>
  </DashboardShell>;
}

export function OrdersPage() {
  const { orders } = useYard();
  return <DashboardShell title="Purchase orders" eyebrow="APPROVED BUYING">
    <section className="dash-panel">
      <div className="panel-head"><div><span>APPROVED BUYING</span><h2>{orders.length} recent orders</h2></div><Link to="/approvals">Approve more <ArrowRight /></Link></div>
      <div className="order-list">{orders.map((o) => <Link to="/orders/$id" params={{ id: o.id }} key={o.id}>
        <PackageCheck /><span><strong>{o.id}</strong><small>{o.date}</small></span><span><strong>{o.supplier}</strong><small>{o.item}</small></span><b>{o.total}</b>
        <Status tone={o.status.toLowerCase().replaceAll(" ", "-")}>{o.status}</Status><ArrowRight />
      </Link>)}</div>
    </section>
  </DashboardShell>;
}

export function ActivityPage() {
  const { activity } = useYard();
  return <DashboardShell title="Activity" eyebrow="RECORD">
    <section className="timeline">{activity.map((a, i) => <article key={a.time + a.title + i}>
      <time>{a.time}</time><i /><div><span>{a.type.toUpperCase()}</span><h2>{a.title}</h2><p>{a.detail}</p></div>
    </article>)}</section>
  </DashboardShell>;
}

const team = [["HM", "Henry Marfo", "Owner", "Full access"], ["AA", "Ama Aidoo", "Buyer", "Quotes & approvals"], ["KA", "Kojo Antwi", "Staff", "Inbox & quotes"], ["EM", "Esi Mensah", "Staff", "Inbox & suppliers"]] as const;

export function TeamDashboardPage() {
  const [invited, setInvited] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  return <DashboardShell title="Team & roles" eyebrow="ADOM YARD">
    <div className="team-table">
      <div className="panel-head"><div><span>ADOM YARD</span><h2>{team.length + invited.length} members</h2></div></div>
      {team.map((x) => <article key={x[1]}><b>{x[0]}</b><span><strong>{x[1]}</strong><small>{x[3]}</small></span><Status tone="active">{x[2]}</Status></article>)}
      {invited.map((e) => <article key={e}><b>{e.slice(0, 2).toUpperCase()}</b><span><strong>{e}</strong><small>Invitation sent</small></span><Status tone="review">Pending</Status></article>)}
      <form className="invite-row" onSubmit={(e: FormEvent) => { e.preventDefault(); if (email.trim()) { setInvited([...invited, email.trim()]); setEmail(""); } }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@adomyard.com" aria-label="Teammate email" />
        <Button type="submit"><Plus /> Invite member</Button>
      </form>
    </div>
  </DashboardShell>;
}

const settingsTabs = ["Yard profile", "Inbox", "Integrations", "Demo mode"] as const;

export function SettingsPage() {
  const [tab, setTab] = useState<(typeof settingsTabs)[number]>("Yard profile");
  const [saved, setSaved] = useState(false);
  return <DashboardShell title="Settings" eyebrow="WORKSPACE">
    <div className="settings-layout">
      <nav>{settingsTabs.map((t) => <button key={t} type="button" className={tab === t ? "is-active" : ""} onClick={() => { setTab(t); setSaved(false); }}>{t}</button>)}</nav>
      <section>
        <span>{tab.toUpperCase()}</span>
        {tab === "Yard profile" && <form onSubmit={(e: FormEvent) => { e.preventDefault(); setSaved(true); }}>
          <h2>Workspace details</h2>
          <label>Yard name<input defaultValue="Adom Yard" /></label>
          <label>Location<input defaultValue="North Kaneshie, Accra" /></label>
          <Button type="submit">Save changes</Button>
          {saved && <p className="saved-note"><Check /> Saved in this demo session.</p>}
        </form>}
        {tab === "Inbox" && <form onSubmit={(e: FormEvent) => { e.preventDefault(); setSaved(true); }}>
          <h2>Procurement inbox</h2>
          <label>Inbox address<input defaultValue="quotes@adom.yard.africa" /></label>
          <label>Forwarding<input defaultValue="henry@adomyard.com" /></label>
          <Button type="submit">Save changes</Button>
          {saved && <p className="saved-note"><Check /> Saved in this demo session.</p>}
        </form>}
        {tab === "Integrations" && <div className="integration-list">
          <h2>Integration status</h2>
          {[["AgentMail", "Inbox intake"], ["Firecrawl", "Market checks"], ["Convex", "Live board"]].map((x) => <div key={x[0]}><i /><span><strong>{x[0]}</strong><small>{x[1]} · simulated in demo</small></span><Status tone="ready">Ready</Status></div>)}
        </div>}
        {tab === "Demo mode" && <div className="integration-list">
          <h2>Demo data</h2>
          <p>All quotes, approvals and orders in this workspace are demo records stored in your browser.</p>
          <Button variant="outline" onClick={() => { resetWorkspace(); setSaved(true); }}><RefreshCw /> Reset demo data</Button>
          {saved && <p className="saved-note"><Check /> Workspace reset to the original demo set.</p>}
        </div>}
      </section>
    </div>
  </DashboardShell>;
}

export function QuoteDetailPage({ id }: { id: string }) {
  const { quotes } = useYard();
  const navigate = useNavigate();
  const session = useSession();
  const q = quotes.find((x) => x.id === id);
  if (!q) return <DashboardShell title="Quote not found" eyebrow="QUOTE"><div className="empty-state"><Search /><h3>That quote no longer exists.</h3><p>It may have been reset with the demo data.</p><Link className="button button--dark" to="/board">Back to live board</Link></div></DashboardShell>;
  const actor = session?.name.split(" ")[0] ?? "Henry";
  const v = variance(q);
  return <DashboardShell title={q.id} eyebrow="QUOTE DETAIL">
    <Link className="back-link" to="/board"><ArrowLeft /> Back to live board</Link>
    <div className="quote-layout">
      <section>
        <div className="quote-title"><div><span>{q.supplier}</span><h2>{q.material}</h2><p>{q.specification} · {q.quantity}</p></div><Status>{q.status}</Status></div>
        <div className="price-compare">
          <div><span>SUPPLIER QUOTE</span><strong>{money(q.quoted)}</strong></div>
          <div><span>PUBLIC BENCHMARK</span><strong>{money(q.market)}</strong><small>3 sources · {q.fresh}</small></div>
          <div><span>VARIANCE</span><strong className={v > 0 ? "variance-up" : "variance-down"}>{v > 0 ? "+" : ""}{v.toFixed(1)}%</strong></div>
        </div>
        <div className="evidence">
          <h3>Market evidence</h3>
          {["ghanatradehub.com", "accrabuilders.market", "steelprice.gh"].map((s) => <div key={s}><span>{s}</span><b>{money(Math.round(q.market * (0.97 + Math.random() * 0.06)))}</b><small>checked {q.fresh}</small></div>)}
          <p>Prices are public references collected for comparison, not guarantees.</p>
        </div>
      </section>
      <aside className="quote-side">
        <div><span>OWNER</span><strong>{q.assignee}</strong>
          <div className="assign-row">{["Kojo", "Ama", "Esi"].map((p) => <button key={p} type="button" className={q.assignee === p ? "is-active" : ""} onClick={() => assignQuote(q.id, p)}>{p}</button>)}</div>
        </div>
        <div><span>EXTRACTION CONFIDENCE</span><strong>{q.confidence}%</strong><small>Parsed from {q.id}_quotation.pdf</small></div>
        <div className="quote-actions">
          <Button onClick={() => { setQuoteStatus(q.id, "Approved", actor); void navigate({ to: "/orders" }); }}><Check /> Approve & order</Button>
          <Button variant="outline" onClick={() => setQuoteStatus(q.id, "Needs info", actor)}><Send /> Request changes</Button>
          <Button variant="outline" onClick={() => setQuoteStatus(q.id, "Rejected", actor)}><X /> Reject</Button>
        </div>
      </aside>
    </div>
  </DashboardShell>;
}

export function SupplierDetailPage({ id }: { id: string }) {
  const { quotes } = useYard();
  const s = suppliers.find((x) => x.id === id);
  if (!s) return <DashboardShell title="Supplier not found" eyebrow="SUPPLIER"><div className="empty-state"><Search /><h3>No supplier with that reference.</h3><Link className="button button--dark" to="/suppliers">Back to suppliers</Link></div></DashboardShell>;
  return <DashboardShell title={s.name} eyebrow="SUPPLIER">
    <Link className="back-link" to="/suppliers"><ArrowLeft /> Back to suppliers</Link>
    <div className="supplier-profile">
      <div className="score score--large">{s.score}</div>
      <div><Status tone={s.status.toLowerCase()}>{s.status}</Status><h2>{s.category} supplier</h2><p>Average response {s.response} · {s.winRate} win rate · {s.spend} lifetime spend</p></div>
    </div>
    <QuoteTable data={quotes.filter((q) => q.supplier === s.name)} />
  </DashboardShell>;
}

export function OrderDetailPage({ id }: { id: string }) {
  const { orders } = useYard();
  const o = orders.find((x) => x.id === id);
  if (!o) return <DashboardShell title="Order not found" eyebrow="PURCHASE ORDER"><div className="empty-state"><PackageCheck /><h3>No purchase order with that reference.</h3><Link className="button button--dark" to="/orders">Back to orders</Link></div></DashboardShell>;
  return <DashboardShell title={o.id} eyebrow="PURCHASE ORDER">
    <Link className="back-link" to="/orders"><ArrowLeft /> Back to purchase orders</Link>
    <section className="order-detail">
      <Status tone={o.status.toLowerCase().replaceAll(" ", "-")}>{o.status}</Status>
      <h2>{o.supplier}</h2><p>{o.item}</p><strong>{o.total}</strong>
      <div><span>Issued</span><b>{o.date} 2026</b></div>
      <div><span>Delivery</span><b>Yard gate · North Kaneshie</b></div>
      <div className="quote-actions">
        <Button onClick={() => setOrderStatus(o.id, "Delivered")}><Check /> Mark delivered</Button>
        <Button variant="outline" onClick={() => setOrderStatus(o.id, "Awaiting delivery")}><Clock3 /> Awaiting delivery</Button>
      </div>
    </section>
  </DashboardShell>;
}

export function SupplierPortalPage() {
  const { supplierQuotes } = useYard();
  const session = useSession();
  const [sent, setSent] = useState(false);
  const [price, setPrice] = useState("23880");
  const org = session ? roleProfiles[session.role].org : "Aseda Steel Works";
  function submit(e: FormEvent) { e.preventDefault(); submitSupplierQuote("16mm high-tensile rods", money(Number(price) || 0)); setSent(true); }
  return <DashboardShell title="Supplier portal" eyebrow={org.toUpperCase()}>
    <div className="supplier-portal">
      <section className="dash-panel">
        <div className="panel-head"><div><span>OPEN REQUEST</span><h2>16mm high-tensile rods</h2></div><Status tone="review">Due today</Status></div>
        <p>Adom Yard · 240 lengths · delivery to North Kaneshie</p>
        {sent ? <div className="form-success"><Check /><h2>Quote submitted.</h2><p>Adom Yard can now review your offer on their live board.</p><Button variant="outline" onClick={() => setSent(false)}>Submit another price</Button></div> : <form onSubmit={submit}>
          <label>Total price (GH₵)<input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" required /></label>
          <label>Lead time<input defaultValue="3 days" required /></label>
          <label>Notes<textarea defaultValue="Price valid for seven days." rows={3} /></label>
          <Button type="submit"><Send /> Submit quote</Button>
        </form>}
      </section>
      <section className="dash-panel">
        <div className="panel-head"><div><span>HISTORY</span><h2>Your quotes</h2></div></div>
        <div className="order-list">{supplierQuotes.map((q) => <div className="order-row" key={q.id}><PackageCheck /><span><strong>{q.id}</strong><small>{q.date}</small></span><span><strong>{q.material}</strong><small>{q.total}</small></span><Status tone={q.status.toLowerCase().replaceAll(" ", "-")}>{q.status}</Status></div>)}</div>
      </section>
    </div>
  </DashboardShell>;
}
