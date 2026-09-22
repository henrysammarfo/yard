import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { TeamPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/team")({
  head: () =>
    seoHead({
      title: 'Team — YARD',
      description: 'Built for everyday buyers who still price jobs from supplier email.',
      path: '/team',
    }),
  component: TeamPage,
});
