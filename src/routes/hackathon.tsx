import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { HackathonPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/hackathon")({
  head: () =>
    seoHead({
      title: 'Build log — YARD',
      description: 'Convex All Gas build log for the live YARD loop.',
      path: '/hackathon',
    }),
  component: HackathonPage,
});
