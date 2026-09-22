import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { LegalPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/terms")({
  head: () =>
    seoHead({
      title: 'Terms — YARD',
      description: 'Terms governing use of the YARD workspace.',
      path: '/terms',
    }),
  component: () => <LegalPage kind="Terms" />,
});
