import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Archive, Bell, Boxes, ChevronDown, FileCheck2, Inbox, LayoutDashboard, Menu, PackageCheck, Search, Settings, ShieldCheck, Truck, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { YardMark } from "./brand";

const nav = [
  ["Overview", "/dashboard", LayoutDashboard], ["Inbox", "/inbox", Inbox], ["Live board", "/board", Archive], ["Approvals", "/approvals", FileCheck2], ["Suppliers", "/suppliers", Truck], ["Materials", "/materials", Boxes], ["Purchase orders", "/orders", PackageCheck], ["Activity", "/activity", Activity], ["Team & roles", "/team", Users],
] as const;

export function DashboardShell({ children, title, eyebrow = "OWNER WORKSPACE" }: { children: ReactNode; title: string; eyebrow?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menu, setMenu] = useState(false);
  return <div className="app-shell">
    <aside className={`sidebar${menu ? " is-open" : ""}`}>
      <div className="sidebar__brand"><YardMark /><Button variant="ghost" size="icon" className="sidebar-close" onClick={() => setMenu(false)} aria-label="Close navigation"><X /></Button></div>
      <div className="yard-switcher"><span className="yard-switcher__avatar">AY</span><span><strong>Adom Yard</strong><small>North Kaneshie</small></span><ChevronDown /></div>
      <nav className="app-nav">{nav.map(([label,to,Icon]) => <Link key={to} to={to} className={pathname === to || (to !== "/dashboard" && pathname.startsWith(to)) ? "is-active" : ""} onClick={() => setMenu(false)}><Icon /><span>{label}</span>{label === "Inbox" && <b>3</b>}</Link>)}</nav>
      <div className="sidebar__bottom"><Link to="/settings"><Settings />Settings</Link><Link to="/security"><ShieldCheck />Trust centre</Link><div className="user-chip"><span>HM</span><div><strong>Henry Marfo</strong><small>Owner</small></div><ChevronDown /></div></div>
    </aside>
    {menu && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenu(false)} />}
    <main className="workspace"><header className="workspace-header"><div className="workspace-title"><Button variant="ghost" size="icon" className="app-menu" onClick={() => setMenu(true)} aria-label="Open navigation"><Menu /></Button><div><span>{eyebrow}</span><h1>{title}</h1></div></div><div className="workspace-tools"><div className="mode-pill"><i />Demo mode</div><Button variant="outline" size="icon" aria-label="Search"><Search /></Button><Button variant="outline" size="icon" aria-label="Notifications" className="notification"><Bell /><i /></Button><Link to="/settings" className="avatar-link">HM</Link></div></header><div className="workspace-body">{children}</div></main>
  </div>;
}

export function Status({ children, tone }: { children: ReactNode; tone?: string }) { return <span className={`status ${tone ?? String(children).toLowerCase().replaceAll(" ", "-")}`}>{children}</span>; }
export function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Activity }) { return <article className="metric"><div className="metric__head"><span>{label}</span><Icon /></div><strong>{value}</strong><small>{note}</small></article>; }
