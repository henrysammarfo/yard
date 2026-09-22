import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { SuppliersPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/suppliers")({
  head: () =>
    seoHead({
      title: 'Suppliers — YARD',
      description: 'Supplier directory for your workspace.',
      path: '/suppliers',
    }),
  component: SuppliersPage,
});
