import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { FaqsPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/faqs")({
  head: () =>
    seoHead({
      title: 'FAQs — YARD',
      description: 'Clear answers on suppliers, prices, approvals, and live services.',
      path: '/faqs',
    }),
  component: FaqsPage,
});
