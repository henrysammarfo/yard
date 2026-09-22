import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type AppPath =
  | "/"
  | "/auth"
  | "/dashboard"
  | "/inbox"
  | "/board"
  | "/approvals"
  | "/suppliers"
  | "/materials"
  | "/orders"
  | "/activity"
  | "/settings"
  | "/workspace-team"
  | "/supplier-portal"
  | "/security";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: { to: AppPath; label: string } | ReactNode;
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__card">
        <span className="empty-state__icon" aria-hidden>
          <Icon />
        </span>
        <h3>{title}</h3>
        <p>{body}</p>
        {action &&
          (typeof action === "object" && action !== null && "to" in action ? (
            <Link className="button button--dark empty-state__cta" to={action.to}>
              {action.label}
            </Link>
          ) : (
            action
          ))}
      </div>
    </div>
  );
}
