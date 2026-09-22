import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { SettingsPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/settings")({
  head: () =>
    seoHead({
      title: 'Settings — YARD',
      description: 'Inbox, integrations, and workspace profile.',
      path: '/settings',
    }),
  component: SettingsPage,
});
