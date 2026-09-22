import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { BoardPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/board")({
  head: () =>
    seoHead({
      title: 'Live board — YARD',
      description: 'All quotes with page-price evidence and status.',
      path: '/board',
    }),
  component: BoardPage,
});
