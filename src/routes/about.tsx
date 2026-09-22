import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YARD" },
      {
        name: "description",
        content: "Why YARD is building an Accra-first decision layer for procurement.",
      },
      { property: "og:title", content: "About — YARD" },
      {
        property: "og:description",
        content: "Why YARD is building an Accra-first decision layer for procurement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});
