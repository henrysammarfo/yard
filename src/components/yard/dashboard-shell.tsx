import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, Archive, Bell, Boxes, ChevronDown, FileCheck2, Handshake, Inbox, LayoutDashboard, LogOut, Menu, PackageCheck, Search, Settings, ShieldCheck, Truck, Users, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { allowedFor, roleProfiles, signOut, useSession } from "@/lib/yard-session";
import { useYard } from "@/lib/yard-store";
import { YardMark } from "./brand";
import { Protected } from "./guard";

const nav = [
  ["Overview", "/dashboard", LayoutDashboard], ["Inbox", "/inbox", Inbox], ["Live board", "/board", Archive], ["Approvals", "/approvals", FileCheck2], ["Suppliers", "/suppliers", Truck], ["Materials", "/materials", Boxes], ["Purchase orders", "/orders", PackageCheck], ["Activity", "/activity", Activity], ["Team & roles", "/workspace-team", Users], ["Supplier portal", "/supplier-portal", Handshake],
] as const;

function Shell({ children, title, eyebrow }: { children: ReactNode; title: string; eyebrow: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const session = useSession();
  const { quotes, activity: feed } = useYard();
  const navigate = useNavigate();
  const role = session?.role ?? "owner";
  const profile = roleProfiles[role];
  const items = useMemo(() => nav.filter(([, to]) => allowedFor(to).includes(role)), [role]);
  const pending = quotes.filter((q) => q.status === "Review").length;
  const results = query.trim() ? quotes.filter((q) => (q.id + q.material + q.supplier).toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];

  function leave() { signOut(); void navigate({ to: "/auth" }); }

  return <div className="app-shell">
    <aside className={`sidebar${menu ? " is-open" : ""}`}>
      <div className="sidebar__brand"><YardMark /><Button variant="ghost" size="icon" className="sidebar-close" onClick={() => setMenu(false)} aria-label="Close navigation"><X /></Button></div>
      <div className="yard-switcher"><span className="yard-switcher__avatar">{profile.org.slice(0, 2).toUpperCase()}</span><span><strong>{profile.org}</strong><small>{role === "supplier" ? "Supplier account" : "North Kaneshie"}</small></span><ChevronDown /></div>
      <nav className="app-nav">{items.map(([label, to, Icon]) => <Link key={to} to={to} className={pathname === to || (to !== "/dashboard" && pathname.startsWith(to)) ? "is-active" : ""} onClick={() => setMenu(false)}><Icon /><span>{label}</span>{label === "Inbox" && pending > 0 && <b>{pending}</b>}</Link>)}</nav>
      <div className="sidebar__bottom">
        {role === "owner" && <Link to="/settings" onClick={() => setMenu(false)}><Settings />Settings</Link>}
        <Link to="/security" onClick={() => setMenu(false)}><ShieldCheck />Trust centre</Link>
        <div className="user-chip"><span>{session?.initials ?? "HM"}</span><div><strong>{session?.name ?? "Henry Marfo"}</strong><small>{profile.label}</small></div><button type="button" onClick={leave} aria-label="Sign out"><LogOut /></button></div>
      </div>
    </aside>
    {menu && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenu(false)} />}
    <main className="workspace">
      <header className="workspace-header">
        <div className="workspace-title"><Button variant="ghost" size="icon" className="app-menu" onClick={() => setMenu(true)} aria-label="Open navigation"><Menu /></Button><div><span>{eyebrow}</span><h1>{title}</h1></div></div>
        <div className="workspace-tools">
          <div className="mode-pill"><i />Demo mode</div>
          <div className="workspace-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search quotes" aria-label="Search quotes" />
            {results.length > 0 && <div className="search-results">{results.map((q) => <Link key={q.id} to="/quotes/$id" params={{ id: q.id }} onClick={() => setQuery("")}><strong>{q.id}</strong><span>{q.material} · {q.supplier}</span></Link>)}</div>}
          </div>
          <Link to="/activity" className="notification" aria-label={`Notifications: ${feed.length} events`}><Bell />{feed.length > 0 && <i />}</Link>
          <button type="button" className="avatar-link" onClick={() => setUserMenu(!userMenu)} aria-label="Account menu">{session?.initials ?? "HM"}</button>
          {userMenu && <div className="user-menu"><strong>{session?.name}</strong><small>{profile.label} · {profile.org}</small><Link to="/auth" onClick={() => setUserMenu(false)}>Switch role</Link><button type="button" onClick={leave}>Sign out</button></div>}
        </div>
      </header>
      <div className="workspace-body">{children}</div>
    </main>
  </div>;
}

export function DashboardShell({ children, title, eyebrow = "WORKSPACE" }: { children: ReactNode; title: string; eyebrow?: string }) {
  return <Protected><Shell title={title} eyebrow={eyebrow}>{children}</Shell></Protected>;
}

export function Status({ children, tone }: { children: ReactNode; tone?: string }) { return <span className={`status ${tone ?? String(children).toLowerCase().replaceAll(" ", "-")}`}>{children}</span>; }
export function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Activity }) { return <article className="metric"><div className="metric__head"><span>{label}</span><Icon /></div><strong>{value}</strong><small>{note}</small></article>; }
