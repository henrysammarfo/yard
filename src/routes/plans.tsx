import { createFileRoute } from "@tanstack/react-router";
import { PlansPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Plans — YARD" },
      {
        name: "description",
        content: "Simple YARD plans for single sites, growing groups, and yard networks.",
      },
      { property: "og:title", content: "Plans — YARD" },
      {
        property: "og:description",
        content: "Simple YARD plans for single sites, growing groups, and yard networks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlansPage,
});
