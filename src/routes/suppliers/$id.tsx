import { createFileRoute } from "@tanstack/react-router";
import { SupplierDetailPage } from "@/components/yard/dashboard-pages";
export const Route = createFileRoute("/suppliers/$id")({
  head: () => ({
    meta: [
      { title: "Supplier detail — YARD" },
      { name: "description", content: "Supplier scorecard and quote history." },
      { property: "og:title", content: "Supplier detail — YARD" },
      { property: "og:description", content: "Supplier scorecard and quote history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const { id } = Route.useParams();
  return <SupplierDetailPage id={id} />;
}
