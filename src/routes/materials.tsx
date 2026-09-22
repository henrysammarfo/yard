import { createFileRoute } from "@tanstack/react-router";
import { MaterialsPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Market prices — YARD" },
      { name: "description", content: "Current market evidence for tracked materials." },
      { property: "og:title", content: "Market prices — YARD" },
      { property: "og:description", content: "Current market evidence for tracked materials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaterialsPage,
});
