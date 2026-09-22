import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { HelpPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/help")({
  head: () =>
    seoHead({
      title: 'Help — YARD',
      description: 'Guides for inbox setup, quote review, approvals, and settings.',
      path: '/help',
    }),
  component: HelpPage,
});
