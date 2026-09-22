import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { LegalPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/privacy")({
  head: () =>
    seoHead({
      title: 'Privacy — YARD',
      description: 'How YARD handles account, supplier, and quote information.',
      path: '/privacy',
    }),
  component: () => <LegalPage kind="Privacy" />,
});
