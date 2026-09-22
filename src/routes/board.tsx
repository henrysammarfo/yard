import { createFileRoute } from "@tanstack/react-router";
import { BoardPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "Live board — YARD" },
      { name: "description", content: "Market-checked quotes and buying decisions." },
      { property: "og:title", content: "Live board — YARD" },
      { property: "og:description", content: "Market-checked quotes and buying decisions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BoardPage,
});
