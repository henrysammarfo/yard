import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { ContactPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/contact")({
  head: () =>
    seoHead({
      title: 'Contact — YARD',
      description: 'Book a short demo of the YARD quote-to-decision loop.',
      path: '/contact',
    }),
  component: ContactPage,
});
