import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { SupplierPortalPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/supplier-portal")({
  head: () =>
    seoHead({
      title: 'Supplier portal — YARD',
      description: 'Open requests and quote history for suppliers.',
      path: '/supplier-portal',
    }),
  component: SupplierPortalPage,
});
