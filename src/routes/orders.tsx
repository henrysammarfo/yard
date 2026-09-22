import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { OrdersPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/orders")({
  head: () =>
    seoHead({
      title: 'Purchase orders — YARD',
      description: 'Approved quotes turned into purchase orders.',
      path: '/orders',
    }),
  component: OrdersPage,
});
