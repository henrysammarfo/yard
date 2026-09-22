import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Clock3,
  Inbox,
  Mail,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Send,
  TrendingDown,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { roleProfiles, toMutationStatus, useSession, type UiQuote } from "@/lib/yard-session";
import { useQuoteActions, useYard } from "@/lib/yard-store";
import { DashboardShell, Metric, Status } from "./dashboard-shell";
import { EmptyState } from "./empty-state";

const money = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
const variance = (q: UiQuote) => (q.market > 0 ? ((q.quoted - q.market) / q.market) * 100 : 0);

function friendlyError(msg: string): string {
  if (/Cannot read properties|undefined \(reading/i.test(msg)) {
    return "Something failed while drafting or sending the counter. Retry from a new inbound quote.";
  }
  return msg;
}

function QuoteTable({ data }: { data: UiQuote[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No quotes in this view"
        body="Clear the search or pick another filter. New AgentMail quotes appear here live."
        action={{ to: "/settings", label: "Check inbox setup" }}
      />
    );
  }
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Quote</th>
            <th>Material</th>
            <th>Supplier</th>
            <th>Quoted</th>
            <th>Page</th>
            <th>Variance</th>
            <th>Owner</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((q) => {
            const v = variance(q);
            return (
              <tr key={q.id}>
                <td>
                  <Link to="/quotes/$id" params={{ id: q.id }}>
                    {q.id}
                  </Link>
                </td>
                <td>
                  <strong>{q.material}</strong>
                  <small>{q.quantity}</small>
                </td>
                <td>{q.supplier}</td>
                <td>{money(q.quoted)}</td>
                <td>
                  {money(q.market)}
                  <small>{q.fresh}</small>
                </td>
                <td className={v > 0 ? "variance-up" : "variance-down"}>
                  {v > 0 ? "+" : ""}
                  {v.toFixed(1)}%
                </td>
                <td>{q.assignee}</td>
                <td>
                  <Status>{q.status}</Status>
                </td>
                <td>
                  <Link to="/quotes/$id" params={{ id: q.id }} aria-label={`Open ${q.id}`}>
                    <ArrowRight />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardPage() {
  const { quotes, orders, activity, ready } = useYard();
  const session = useSession();
  const review = quotes.filter((q) => q.status === "Review" || q.status === "Needs info");
  const ordered = quotes.filter((q) => q.rawStatus === "approved");
  const high = quotes.filter((q) => q.market > 0 && q.quoted > q.market);
  const exposure = high.reduce((sum, q) => sum + (q.quoted - q.market), 0);
  const approvedValue = orders.reduce((sum, o) => {
    const n = Number(String(o.total).replace(/[^0-9.-]/g, ""));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
  return (
    <DashboardShell
      title={`Good morning, ${session?.name.split(" ")[0] ?? "team"}.`}
      eyebrow="OWNER WORKSPACE"
    >
      {!ready && <p className="loading-note">Loading live workspace…</p>}
      <div className="metrics-grid">
        <Metric
          label="Quotes in play"
          value={String(quotes.length)}
          note={`${review.length} awaiting a decision`}
          icon={Inbox}
        />
        <Metric
          label="Approved value"
          value={money(approvedValue || ordered.reduce((s, q) => s + q.quoted, 0))}
          note={`Across ${orders.length} purchase orders`}
          icon={CircleDollarSign}
        />
        <Metric
          label="High-quote exposure"
          value={money(exposure)}
          note="Quoted above the public page price"
          icon={TrendingDown}
        />
        <Metric
          label="Live updates"
          value="On"
          note="Realtime workspace sync is active"
          icon={Clock3}
        />
      </div>
      <section className="dash-grid">
        <article className="dash-panel dash-panel--wide">
          <div className="panel-head">
            <div>
              <span>URGENT DECISIONS</span>
              <h2>Quotes needing eyes</h2>
            </div>
            <Link to="/approvals">
              View all <ArrowRight />
            </Link>
          </div>
          {review.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nothing waiting yet"
              body="When a supplier emails a quote, it lands here for review. Configure AgentMail in Settings to go live."
              action={{ to: "/settings", label: "Open Settings" }}
            />
          ) : (
            <QuoteTable data={review.slice(0, 3)} />
          )}
        </article>
        <article className="dash-panel">
          <div className="panel-head">
            <div>
              <span>LIVE ACTIVITY</span>
              <h2>Today</h2>
            </div>
            <Activity />
          </div>
          <div className="activity-list">
            {activity.slice(0, 5).map((a, i) => (
              <div key={a.time + a.title + i}>
                <time>{a.time}</time>
                <span>
                  <strong>{a.title}</strong>
                  <small>{friendlyError(a.detail)}</small>
                </span>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="empty-inline">
                No activity yet. Inbound mail and decisions will show up here in realtime.
              </p>
            )}
          </div>
          <Link className="panel-link" to="/activity">
            Full activity <ArrowRight />
          </Link>
        </article>
      </section>
    </DashboardShell>
  );
}

const filters = ["All", "Review", "Matched", "Approved", "Needs info", "Countered", "Rejected"] as const;

export function BoardPage() {
  const { quotes } = useYard();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const data = useMemo(
    () =>
      quotes.filter(
        (q) =>
          (filter === "All" || q.status === filter) &&
          (q.material + q.supplier + q.id).toLowerCase().includes(query.toLowerCase()),
      ),
    [quotes, query, filter],
  );
  return (
    <DashboardShell title="Live board" eyebrow="PROCUREMENT">
      <div className="toolbar">
        <label>
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quotes, materials, suppliers"
          />
        </label>
        <div>
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter${filter === f ? " is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f} {f === "All" ? quotes.length : quotes.filter((q) => q.status === f).length}
            </button>
          ))}
        </div>
      </div>
      <QuoteTable data={data} />
    </DashboardShell>
  );
}

export function InboxPage() {
  const { quotes } = useYard();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = quotes.find((q) => q.id === selectedId) ?? quotes[0];
  return (
    <DashboardShell title="Inbox" eyebrow="MAIL INTAKE">
      {quotes.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="Waiting for supplier mail"
          body="Point AgentMail at this workspace in Settings. Inbound webhooks create live quote rows the moment a supplier emails you."
          action={{ to: "/settings", label: "Configure AgentMail" }}
        />
      ) : (
        <div className="inbox-layout">
          <aside>
            {quotes.map((q) => (
              <button
                key={q.id}
                type="button"
                className={selected?.id === q.id ? "is-active" : ""}
                onClick={() => setSelectedId(q.id)}
              >
                <span>
                  <b>{q.initials}</b>
                  <strong>{q.supplier}</strong>
                  <time>{q.received}</time>
                </span>
                <h3>Quote: {q.material}</h3>
                <p>
                  {q.quantity} · {q.status}
                </p>
              </button>
            ))}
          </aside>
          {selected && (
            <article className="mail-view">
              <div className="mail-head">
                <div>
                  <span className="supplier-avatar">{selected.initials}</span>
                  <div>
                    <h2>{selected.supplier}</h2>
                    <p>Inbound via AgentMail</p>
                  </div>
                </div>
                <Status>{selected.status}</Status>
              </div>
              <h1>Quotation for {selected.material}</h1>
              <p>{selected.sourceText ?? "Supplier quote body stored from the inbound webhook."}</p>
              {selected.extractError && (
                <p className="form-error">Extract: {selected.extractError}</p>
              )}
              {selected.draftError && <p className="form-error">Counter: {selected.draftError}</p>}
              <div className="parsed-box">
                <span>EXTRACTED LINE ITEM</span>
                <h3>{selected.material}</h3>
                <p>
                  {selected.specification} · {selected.quantity}
                </p>
                <strong>{money(selected.quoted)} / unit</strong>
              </div>
              <Link className="button button--dark" to="/quotes/$id" params={{ id: selected.id }}>
                Open quote <ArrowRight />
              </Link>
            </article>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

export function ApprovalsPage() {
  const { quotes } = useYard();
  const actions = useQuoteActions();
  const [confirm, setConfirm] = useState<{
    id: string;
    quoteId: UiQuote["quoteId"];
    action: "Approved" | "Rejected";
  } | null>(null);
  const pending = quotes.filter((q) => q.status === "Review" || q.status === "Needs info");
  return (
    <DashboardShell title="Approvals" eyebrow="DECISIONS">
      <section className="dash-panel">
        <div className="panel-head">
          <div>
            <span>DECISION QUEUE</span>
            <h2>{pending.length} awaiting approval</h2>
          </div>
        </div>
        {pending.length === 0 ? (
          <EmptyState
            icon={Check}
            title="Queue clear"
            body="Every quote has a decision. New supplier mail lands here automatically."
            action={{ to: "/inbox", label: "Go to Inbox" }}
          />
        ) : (
          <div className="approval-list">
            {pending.map((q) => (
              <article key={q.id}>
                <div>
                  <span>{q.id}</span>
                  <h3>{q.material}</h3>
                  <p>
                    {q.supplier} · {q.quantity}
                  </p>
                </div>
                <div>
                  <small>QUOTED</small>
                  <strong>{money(q.quoted)}</strong>
                </div>
                <div>
                  <small>VS PAGE</small>
                  <strong className={q.quoted > q.market ? "variance-up" : "variance-down"}>
                    {variance(q).toFixed(1)}%
                  </strong>
                </div>
                <div className="approval-actions">
                  <Button
                    onClick={() => setConfirm({ id: q.id, quoteId: q.quoteId, action: "Approved" })}
                  >
                    <Check /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirm({ id: q.id, quoteId: q.quoteId, action: "Rejected" })}
                  >
                    <X /> Reject
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {confirm && (
        <div className="dialog-scrim" role="dialog" aria-modal="true">
          <div className="dialog">
            <h2>{confirm.action === "Approved" ? "Approve this quote?" : "Reject this quote?"}</h2>
            <p>
              {confirm.action === "Approved"
                ? "A purchase order is created from this quote in Convex."
                : "The quote is marked rejected. Fail-closed counters already used AgentMail when the page price was lower."}
            </p>
            <div className="dialog__actions">
              <Button variant="outline" onClick={() => setConfirm(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  void (async () => {
                    if (confirm.action === "Approved")
                      await actions.approveToOrder(confirm.quoteId);
                    else
                      await actions.setQuoteStatus(
                        confirm.quoteId,
                        toMutationStatus(confirm.action),
                      );
                    setConfirm(null);
                  })();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export function SuppliersPage() {
  const { suppliers } = useYard();
  const [query, setQuery] = useState("");
  const data = suppliers.filter((s) =>
    (s.name + s.category).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <DashboardShell title="Suppliers" eyebrow="NETWORK">
      <div className="toolbar">
        <label>
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suppliers"
          />
        </label>
      </div>
      {data.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No suppliers yet"
          body="Suppliers appear as quotes arrive. You can also add them from an owner workflow once mail is flowing."
          action={{ to: "/inbox", label: "Open Inbox" }}
        />
      ) : (
        <div className="supplier-grid">
          {data.map((s) => (
            <Link to="/suppliers/$id" params={{ id: s.id }} key={s.id}>
              <div className="score">{s.score}</div>
              <Status tone={s.status.toLowerCase()}>{s.status}</Status>
              <h2>{s.name}</h2>
              <p>{s.category}</p>
              <dl>
                <div>
                  <dt>Quotes</dt>
                  <dd>{s.quotes}</dd>
                </div>
                <div>
                  <dt>Win rate</dt>
                  <dd>{s.winRate}</dd>
                </div>
                <div>
                  <dt>Response</dt>
                  <dd>{s.response}</dd>
                </div>
                <div>
                  <dt>Spend</dt>
                  <dd>{s.spend}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

export function MaterialsPage() {
  const session = useSession();
  const { materials } = useYard();
  const actions = useQuoteActions();
  const upsertMaterial = useMutation(api.catalog.upsertMaterial);
  const [refreshed, setRefreshed] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <DashboardShell title="Market prices" eyebrow="PUBLIC EVIDENCE">
      <section className="dash-panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div>
            <span>TRACK MATERIAL</span>
            <h2>Add a public page for Firecrawl</h2>
          </div>
        </div>
        <form
          className="contact-form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!session?.orgId) return;
            const form = e.currentTarget;
            const fd = new FormData(form);
            setError(null);
            setSaved(false);
            void upsertMaterial({
              orgId: session.orgId,
              name: String(fd.get("name") ?? ""),
              category: String(fd.get("category") ?? "General"),
              unit: String(fd.get("unit") ?? "unit"),
              pageUrl: String(fd.get("url") ?? "") || undefined,
            })
              .then(() => {
                setSaved(true);
                form.reset();
              })
              .catch((err: Error) => setError(err.message));
          }}
        >
          <label>
            Material name
            <input name="name" required placeholder="Cement 42.5R" />
          </label>
          <label>
            Category
            <input name="category" defaultValue="Aggregates" />
          </label>
          <label>
            Unit
            <input name="unit" defaultValue="bag" />
          </label>
          <label>
            Public page URL
            <input name="url" type="url" placeholder="https://…" />
          </label>
          <Button type="submit">
            <Plus /> Add material
          </Button>
          {saved && (
            <p className="saved-note">
              <Check /> Material saved — use Re-check to refresh the page price.
            </p>
          )}
          {error && <p className="form-error">{error}</p>}
        </form>
      </section>
      {materials.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="No tracked materials yet"
          body="Add a material above with a public page URL so Firecrawl can check live unit prices."
        />
      ) : (
        <div className="market-grid">
          {materials.map((m) => (
            <article key={m.materialId}>
              <div>
                <span>{m.category}</span>
                <small>{m.freshness === "—" ? "Not checked yet" : `${m.freshness} ago`}</small>
              </div>
              <h2>{m.name}</h2>
              <strong>{m.price}</strong>
              <p>{m.unit}</p>
              <div className={m.direction === "up" ? "variance-up" : "variance-down"}>
                {m.direction === "up" ? <ArrowUpRight /> : <ArrowDownRight />}
                {m.change}
              </div>
              <footer>{m.source} · Firecrawl</footer>
              <Button
                variant="outline"
                onClick={() => {
                  void actions.refreshMarket(m.materialId).then(() => setRefreshed(m.materialId));
                }}
              >
                <RefreshCw /> {refreshed === m.materialId ? "Refresh queued" : "Re-check price"}
              </Button>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

export function OrdersPage() {
  const { orders } = useYard();
  return (
    <DashboardShell title="Purchase orders" eyebrow="APPROVED BUYING">
      <section className="dash-panel">
        <div className="panel-head">
          <div>
            <span>APPROVED BUYING</span>
            <h2>{orders.length} recent orders</h2>
          </div>
          <Link to="/approvals">
            Approve more <ArrowRight />
          </Link>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="No purchase orders yet"
            body="Approve a matched or reviewed quote to create a purchase order."
            action={{ to: "/approvals", label: "Review quotes" }}
          />
        ) : (
          <div className="order-list">
            {orders.map((o) => (
              <Link to="/orders/$id" params={{ id: o.id }} key={o.id}>
                <PackageCheck />
                <span>
                  <strong>{o.id}</strong>
                  <small>{o.date}</small>
                </span>
                <span>
                  <strong>{o.supplier}</strong>
                  <small>{o.item}</small>
                </span>
                <b>{o.total}</b>
                <Status tone={o.status.toLowerCase().replaceAll(" ", "-")}>{o.status}</Status>
                <ArrowRight />
              </Link>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

export function ActivityPage() {
  const { activity } = useYard();
  return (
    <DashboardShell title="Activity" eyebrow="RECORD">
      <section className="timeline">
        {activity.length === 0 && (
          <EmptyState
            icon={Activity}
            title="No events yet"
            body="Mail, crawl, and approval events append here in order as the live loop runs."
            action={{ to: "/settings", label: "Check integrations" }}
          />
        )}
        {activity.map((a, i) => (
          <article key={a.time + a.title + i}>
            <time>{a.time}</time>
            <i />
            <div>
              <span>{a.type.toUpperCase()}</span>
              <h2>{a.title}</h2>
              <p>{friendlyError(a.detail)}</p>
            </div>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}

export function TeamDashboardPage() {
  const session = useSession();
  const members = useQuery(
    api.organizations.listMembers,
    session?.orgId && session.role === "owner" ? { orgId: session.orgId } : "skip",
  );
  const invite = useMutation(api.organizations.inviteMember);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <DashboardShell title="Team & roles" eyebrow={session?.org ?? "WORKSPACE"}>
      <div className="team-table">
        <div className="panel-head">
          <div>
            <span>MEMBERS</span>
            <h2>{members?.length ?? 0} members</h2>
          </div>
        </div>
        {(members ?? []).map((m) => (
          <article key={m._id}>
            <b>{m.name.slice(0, 2).toUpperCase()}</b>
            <span>
              <strong>{m.name}</strong>
              <small>{roleProfiles[m.role].copy}</small>
            </span>
            <Status tone="active">{roleProfiles[m.role].label}</Status>
          </article>
        ))}
        <form
          className="invite-row"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (!session?.orgId) return;
            setError(null);
            void invite({ orgId: session.orgId, email, name: name || email, role: "staff" })
              .then(() => {
                setEmail("");
                setName("");
              })
              .catch((err: Error) => setError(err.message));
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            aria-label="Name"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            aria-label="Teammate email"
          />
          <Button type="submit">
            <Plus /> Invite member
          </Button>
        </form>
        {error && <p className="form-error">{error}</p>}
      </div>
    </DashboardShell>
  );
}

const settingsTabs = ["Yard profile", "Inbox", "Integrations"] as const;

export function SettingsPage() {
  const session = useSession();
  const health = useQuery(
    api.materials.integrationHealth,
    session?.orgId && session.role === "owner" ? { orgId: session.orgId } : "skip",
  );
  const setInbox = useMutation(api.organizations.setInboxId);
  const updateSettings = useMutation(api.organizations.updateSettings);
  const [tab, setTab] = useState<(typeof settingsTabs)[number]>("Yard profile");
  const [saved, setSaved] = useState(false);
  const [inboxId, setInboxId] = useState("");
  return (
    <DashboardShell title="Settings" eyebrow="WORKSPACE">
      <div className="settings-layout">
        <nav>
          {settingsTabs.map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? "is-active" : ""}
              onClick={() => {
                setTab(t);
                setSaved(false);
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <section>
          <span>{tab.toUpperCase()}</span>
          {tab === "Yard profile" && (
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (!session?.orgId) return;
                const fd = new FormData(e.currentTarget);
                void updateSettings({
                  orgId: session.orgId,
                  notifyEmail: String(fd.get("notify") ?? ""),
                  defaultAssignee: String(fd.get("assignee") ?? ""),
                }).then(() => setSaved(true));
              }}
            >
              <h2>Workspace details</h2>
              <label>
                Yard name
                <input defaultValue={session?.org ?? ""} readOnly />
              </label>
              <label>
                Notify email
                <input name="notify" type="email" placeholder="ops@company.com" />
              </label>
              <label>
                Default assignee
                <input name="assignee" placeholder="Ama" />
              </label>
              <Button type="submit">Save changes</Button>
              {saved && (
                <p className="saved-note">
                  <Check /> Saved to Convex.
                </p>
              )}
            </form>
          )}
          {tab === "Inbox" && (
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (!session?.orgId) return;
                void setInbox({ orgId: session.orgId, inboxId }).then(() => setSaved(true));
              }}
            >
              <h2>AgentMail inbox</h2>
              <label>
                Inbox ID
                <input
                  value={inboxId}
                  onChange={(e) => setInboxId(e.target.value)}
                  placeholder="inbox_…"
                  required
                />
              </label>
              <p className="help-copy">Webhook path: /agentmail/webhook on your Convex site URL.</p>
              <Button type="submit">Save inbox</Button>
              {saved && (
                <p className="saved-note">
                  <Check /> Inbox linked.
                </p>
              )}
            </form>
          )}
          {tab === "Integrations" && (
            <div className="integration-list">
              <h2>Integration status</h2>
              <div>
                <i />
                <span>
                  <strong>AgentMail</strong>
                  <small>
                    {health?.agentmail.configured ? "API key present" : "API key missing"} · inbox{" "}
                    {health?.agentmail.inboxId ?? "not linked"}
                  </small>
                </span>
                <Status tone={health?.agentmail.configured ? "ready" : "review"}>
                  {health?.agentmail.configured ? "Configured" : "Needs key"}
                </Status>
              </div>
              <div>
                <i />
                <span>
                  <strong>Firecrawl</strong>
                  <small>
                    {health?.firecrawl.configured ? "API key present" : "API key missing"}
                  </small>
                </span>
                <Status tone={health?.firecrawl.configured ? "ready" : "review"}>
                  {health?.firecrawl.configured ? "Configured" : "Needs key"}
                </Status>
              </div>
              <div>
                <i />
                <span>
                  <strong>LLM draft</strong>
                  <small>
                    AgentRouter {health?.llm.agentRouter ? "on" : "off"} · Venice{" "}
                    {health?.llm.venice ? "on" : "off"} · {health?.llm.note}
                  </small>
                </span>
                <Status tone={health?.llm.agentRouter ? "ready" : "review"}>
                  {health?.llm.agentRouter ? "AgentRouter" : "Needs provider"}
                </Status>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

export function QuoteDetailPage({ id }: { id: string }) {
  const { quotes } = useYard();
  const navigate = useNavigate();
  const actions = useQuoteActions();
  const q = quotes.find((x) => x.id === id);
  if (!q) {
    return (
      <DashboardShell title="Quote not found" eyebrow="QUOTE">
        <EmptyState
          icon={Search}
          title="That quote does not exist"
          body="It may have been removed, or the link is stale."
          action={{ to: "/board", label: "Back to live board" }}
        />
      </DashboardShell>
    );
  }
  const v = variance(q);
  return (
    <DashboardShell title={q.id} eyebrow="QUOTE DETAIL">
      <Link className="back-link" to="/board">
        <ArrowLeft /> Back to live board
      </Link>
      <div className="quote-layout">
        <section>
          <div className="quote-title">
            <div>
              <span>{q.supplier}</span>
              <h2>{q.material}</h2>
              <p>
                {q.specification} · {q.quantity}
              </p>
            </div>
            <Status>{q.status}</Status>
          </div>
          <div className="price-compare">
            <div>
              <span>SUPPLIER QUOTE</span>
              <strong>{money(q.quoted)}</strong>
            </div>
            <div>
              <span>PUBLIC PAGE</span>
              <strong>{money(q.market)}</strong>
              <small>
                {q.fresh}
                {q.pageUrl ? " · Firecrawl" : " · URL pending"}
              </small>
            </div>
            <div>
              <span>VARIANCE</span>
              <strong className={v > 0 ? "variance-up" : "variance-down"}>
                {v > 0 ? "+" : ""}
                {v.toFixed(1)}%
              </strong>
            </div>
          </div>
          <div className="evidence">
            <h3>Evidence</h3>
            {q.pageUrl ? (
              <div className="evidence__row">
                <a href={q.pageUrl} target="_blank" rel="noreferrer" className="evidence-url">
                  {q.pageUrl}
                </a>
                <b className="evidence__price">{money(q.market)}</b>
                <small className="evidence__meta">Firecrawl extract</small>
              </div>
            ) : (
              <p>No public page price yet — fail-closed if extract cannot complete.</p>
            )}
            {q.counterText && (
              <p className="evidence__counter">
                <strong>Counter sent:</strong> {q.counterText}
              </p>
            )}
            {q.extractError && <p className="form-error">{friendlyError(q.extractError)}</p>}
            {q.draftError && !q.counterText && (
              <p className="form-error">{friendlyError(q.draftError)}</p>
            )}
          </div>
        </section>
        <aside className="quote-side">
          <div className="quote-side__block">
            <span className="quote-side__label">Owner</span>
            <strong className="quote-side__value">{q.assignee || "Unassigned"}</strong>
            <div className="assign-row">
              {["Kojo", "Ama", "Esi"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={q.assignee === p ? "is-active" : ""}
                  onClick={() => void actions.assignQuote(q.quoteId, p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="quote-side__block">
            <span className="quote-side__label">Confidence</span>
            <strong className="quote-side__value">{q.confidence}%</strong>
          </div>
          <div className="quote-actions">
            {q.rawStatus !== "approved" && (
              <Button
                onClick={() => {
                  void actions.approveToOrder(q.quoteId).then(() => navigate({ to: "/orders" }));
                }}
              >
                <Check /> {q.rawStatus === "matched" ? "Approve & create PO" : "Approve & order"}
              </Button>
            )}
            {q.rawStatus === "approved" && (
              <Link className="button button--dark" to="/orders">
                View purchase orders <ArrowRight />
              </Link>
            )}
            {q.rawStatus !== "approved" && q.rawStatus !== "rejected" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => void actions.setQuoteStatus(q.quoteId, "needs_info")}
                >
                  <Send /> Request changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void actions.setQuoteStatus(q.quoteId, "rejected")}
                >
                  <X /> Reject
                </Button>
              </>
            )}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}

export function OrderDetailPage({ id }: { id: string }) {
  const { orders } = useYard();
  const actions = useQuoteActions();
  const o = orders.find((x) => x.id === id);
  if (!o) {
    return (
      <DashboardShell title="Order not found" eyebrow="ORDER">
        <EmptyState
          icon={Search}
          title="That order does not exist"
          body="It may have been removed, or the link is stale."
          action={{ to: "/orders", label: "Back to orders" }}
        />
      </DashboardShell>
    );
  }
  return (
    <DashboardShell title={o.id} eyebrow="PURCHASE ORDER">
      <Link className="back-link" to="/orders">
        <ArrowLeft /> Back to orders
      </Link>
      <section className="order-detail">
        <div>
          <span>SUPPLIER</span>
          <h2>{o.supplier}</h2>
          <p>{o.item}</p>
        </div>
        <div>
          <span>TOTAL</span>
          <strong>{o.total}</strong>
        </div>
        <div>
          <span>STATUS</span>
          <Status tone={o.status.toLowerCase().replaceAll(" ", "-")}>{o.status}</Status>
          <div className="assign-row">
            {["Confirmed", "Awaiting delivery", "Delivered"].map((s) => (
              <button
                key={s}
                type="button"
                className={o.status === s ? "is-active" : ""}
                onClick={() => void actions.updateOrderStatus(o.orderId, s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

export function SupplierDetailPage({ id }: { id: string }) {
  const { suppliers, quotes } = useYard();
  const s = suppliers.find((x) => x.id === id);
  if (!s) {
    return (
      <DashboardShell title="Supplier not found" eyebrow="SUPPLIER">
        <EmptyState
          icon={Search}
          title="Unknown supplier"
          body="That supplier record is missing from this workspace."
          action={{ to: "/suppliers", label: "Back to suppliers" }}
        />
      </DashboardShell>
    );
  }
  const related = quotes.filter((q) => q.supplier === s.name);
  return (
    <DashboardShell title={s.name} eyebrow="SUPPLIER">
      <Link className="back-link" to="/suppliers">
        <ArrowLeft /> Back
      </Link>
      <section className="supplier-detail">
        <div className="score">{s.score}</div>
        <Status tone={s.status.toLowerCase()}>{s.status}</Status>
        <p>{s.category}</p>
        <QuoteTable data={related} />
      </section>
    </DashboardShell>
  );
}

export function SupplierPortalPage() {
  const actions = useQuoteActions();
  const { quotes } = useYard();
  const session = useSession();
  const [done, setDone] = useState(false);
  const mine = quotes.filter((q) => q.supplier === session?.name || true).slice(0, 20);
  return (
    <DashboardShell title="Supplier portal" eyebrow="SUPPLIER">
      <section className="dash-panel">
        <div className="panel-head">
          <div>
            <span>SUBMIT QUOTE</span>
            <h2>Send a unit price for checking</h2>
          </div>
        </div>
        <form
          className="contact-form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void actions
              .submitSupplierQuote({
                material: String(fd.get("material") ?? ""),
                specification: String(fd.get("spec") ?? ""),
                quantity: String(fd.get("qty") ?? "1"),
                quotedUnitPrice: Number(fd.get("price")),
                pageUrl: String(fd.get("url") ?? "") || undefined,
              })
              .then(() => setDone(true));
          }}
        >
          <label>
            Material
            <input name="material" required />
          </label>
          <label>
            Specification
            <input name="spec" required />
          </label>
          <label>
            Quantity
            <input name="qty" required defaultValue="1 bag" />
          </label>
          <label>
            Unit price
            <input name="price" type="number" step="0.01" required />
          </label>
          <label>
            Public page URL
            <input name="url" type="url" placeholder="https://…" />
          </label>
          <Button type="submit">
            Submit for Firecrawl check <ArrowRight />
          </Button>
          {done && (
            <p className="saved-note">
              <Check /> Submitted — live check scheduled.
            </p>
          )}
        </form>
      </section>
      <QuoteTable data={mine} />
    </DashboardShell>
  );
}

/** Sign-out helper used by shell */
export function useSignOutNav() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  return async () => {
    await signOut();
    void navigate({ to: "/auth" });
  };
}
