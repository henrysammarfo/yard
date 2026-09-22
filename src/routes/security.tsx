import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { LegalPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/security")({
  head: () =>
    seoHead({
      title: 'Security — YARD',
      description: 'How YARD protects workspace access and supplier records.',
      path: '/security',
    }),
  component: () => <LegalPage kind="Security" />,
});
