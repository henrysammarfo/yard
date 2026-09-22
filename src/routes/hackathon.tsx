import { createFileRoute } from "@tanstack/react-router";
import { HackathonPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/hackathon")({
  head: () => ({
    meta: [
      { title: "Build log — YARD" },
      {
        name: "description",
        content: "YARD’s public Convex All Gas hackathon build log and architecture.",
      },
      { property: "og:title", content: "Build log — YARD" },
      {
        property: "og:description",
        content: "YARD’s public Convex All Gas hackathon build log and architecture.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HackathonPage,
});
