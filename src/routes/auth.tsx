import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthPage } from "@/components/yard/public-pages";

const authSearch = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => authSearch.parse(search),
  head: () => ({
    meta: [
      { title: "Sign in — YARD" },
      { name: "description", content: "Sign in to the YARD workspace with Convex Auth." },
      { property: "og:title", content: "Sign in — YARD" },
      { property: "og:description", content: "Sign in to the YARD workspace with Convex Auth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});
