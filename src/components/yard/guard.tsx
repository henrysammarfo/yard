import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Lock, ShieldAlert } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { allowedFor, roleProfiles, useSession, useSessionReady } from "@/lib/yard-session";
import { YardMark } from "./brand";

export function Protected({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useSession();
  const ready = useSessionReady();
  const navigate = useNavigate();
  const roles = allowedFor(pathname);

  useEffect(() => {
    if (ready && !session) void navigate({ to: "/auth", search: { redirect: pathname }, replace: true });
  }, [ready, session, pathname, navigate]);

  if (!ready || !session) {
    return <div className="gate">
      <YardMark />
      <Lock />
      <h1>Checking your access…</h1>
      <p>This workspace page is protected. Sign in to continue.</p>
      <Link className="button button--dark" to="/auth" search={{ redirect: pathname }}>Sign in</Link>
    </div>;
  }

  if (!roles.includes(session.role)) {
    const home = roleProfiles[session.role].home;
    return <div className="gate">
      <YardMark />
      <ShieldAlert />
      <h1>Not available for the {roleProfiles[session.role].label.toLowerCase()} role.</h1>
      <p>This page is limited to: {roles.map((r) => roleProfiles[r].label).join(", ")}. Switch role from sign in, or go back to your own workspace.</p>
      <div className="gate__actions">
        <Link className="button button--dark" to={home}>Go to my workspace</Link>
        <Button variant="outline" asChild><Link to="/auth" search={{ redirect: pathname }}>Switch role</Link></Button>
      </div>
    </div>;
  }

  return <>{children}</>;
}
