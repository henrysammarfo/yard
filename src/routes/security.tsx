import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — YARD" },
      {
        name: "description",
        content: "How YARD plans to protect workspace access, supplier records, and approvals.",
      },
      { property: "og:title", content: "Security — YARD" },
      {
        property: "og:description",
        content: "How YARD plans to protect workspace access, supplier records, and approvals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LegalPage kind="Security" />,
});
