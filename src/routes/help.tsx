import { createFileRoute } from "@tanstack/react-router";
import { HelpPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help centre — YARD" },
      {
        name: "description",
        content: "Guidance for getting started and running procurement in YARD.",
      },
      { property: "og:title", content: "Help centre — YARD" },
      {
        property: "og:description",
        content: "Guidance for getting started and running procurement in YARD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});
