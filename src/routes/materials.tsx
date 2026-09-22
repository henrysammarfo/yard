import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { MaterialsPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/materials")({
  head: () =>
    seoHead({
      title: 'Materials — YARD',
      description: 'Materials catalog for quote matching.',
      path: '/materials',
    }),
  component: MaterialsPage,
});
