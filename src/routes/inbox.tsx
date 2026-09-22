import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { InboxPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/inbox")({
  head: () =>
    seoHead({
      title: 'Inbox — YARD',
      description: 'Supplier quote email intake and extraction.',
      path: '/inbox',
    }),
  component: InboxPage,
});
