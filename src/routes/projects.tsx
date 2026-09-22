import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { ProjectsPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/projects")({
  head: () =>
    seoHead({
      title: 'Projects — YARD',
      description: 'Three workflows that turn supplier email into a checked buying record.',
      path: '/projects',
    }),
  component: ProjectsPage,
});
