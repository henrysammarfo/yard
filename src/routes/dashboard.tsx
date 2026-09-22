import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { DashboardPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/dashboard")({
  head: () =>
    seoHead({
      title: 'Overview — YARD',
      description: 'Live buying overview for your YARD workspace.',
      path: '/dashboard',
    }),
  component: DashboardPage,
});
