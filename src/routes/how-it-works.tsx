import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { HowItWorksPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/how-it-works")({
  head: () =>
    seoHead({
      title: 'How it works — YARD',
      description: 'From inbox to evidence—fail-closed quote checks.',
      path: '/how-it-works',
    }),
  component: HowItWorksPage,
});
