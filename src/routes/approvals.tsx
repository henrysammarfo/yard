import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { ApprovalsPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/approvals")({
  head: () =>
    seoHead({
      title: 'Approvals — YARD',
      description: 'Quotes waiting for a buying decision.',
      path: '/approvals',
    }),
  component: ApprovalsPage,
});
