import { createFileRoute } from "@tanstack/react-router";
import { ActivityPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — YARD" },
      { name: "description", content: "Operational audit trail for the YARD workspace." },
      { property: "og:title", content: "Activity — YARD" },
      { property: "og:description", content: "Operational audit trail for the YARD workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivityPage,
});
