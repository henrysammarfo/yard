import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/yard/public-pages";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get in touch — YARD" },
      { name: "description", content: "Book a YARD product demo or discuss a procurement pilot." },
      { property: "og:title", content: "Get in touch — YARD" },
      {
        property: "og:description",
        content: "Book a YARD product demo or discuss a procurement pilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});
