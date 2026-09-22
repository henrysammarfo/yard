import { createFileRoute } from "@tanstack/react-router";
import { ApprovalsPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals — YARD" },
      { name: "description", content: "Review and approve pending procurement quotes." },
      { property: "og:title", content: "Approvals — YARD" },
      { property: "og:description", content: "Review and approve pending procurement quotes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApprovalsPage,
});
