import { createFileRoute } from "@tanstack/react-router";
import { FaqsPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — YARD" },
      {
        name: "description",
        content: "Answers about YARD quotes, market checks, approvals, and supplier access.",
      },
      { property: "og:title", content: "FAQs — YARD" },
      {
        property: "og:description",
        content: "Answers about YARD quotes, market checks, approvals, and supplier access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqsPage,
});
