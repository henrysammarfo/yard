import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { ActivityPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/activity")({
  head: () =>
    seoHead({
      title: 'Activity — YARD',
      description: 'Realtime audit trail for the workspace.',
      path: '/activity',
    }),
  component: ActivityPage,
});
