import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — YARD" },
      {
        name: "description",
        content: "Terms governing the YARD product preview and future service.",
      },
      { property: "og:title", content: "Terms — YARD" },
      {
        property: "og:description",
        content: "Terms governing the YARD product preview and future service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LegalPage kind="Terms" />,
});
