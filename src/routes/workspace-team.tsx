import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { TeamDashboardPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/workspace-team")({
  head: () =>
    seoHead({
      title: 'Team — YARD',
      description: 'Roles and membership for your organisation.',
      path: '/workspace-team',
    }),
  component: TeamDashboardPage,
});
