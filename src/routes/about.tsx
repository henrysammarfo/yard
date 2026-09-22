import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { AboutPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/about")({
  head: () =>
    seoHead({
      title: 'About — YARD',
      description: 'YARD checks supplier quotes against public page prices.',
      path: '/about',
    }),
  component: AboutPage,
});
