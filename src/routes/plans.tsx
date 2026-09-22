import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { PlansPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/plans")({
  head: () =>
    seoHead({
      title: 'Plans — YARD',
      description: 'Simple pricing for quote volume, seats, and buying oversight.',
      path: '/plans',
    }),
  component: PlansPage,
});
