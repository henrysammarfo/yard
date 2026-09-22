import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthPage } from "@/components/yard/public-pages";
import { seoHead } from "@/lib/seo";

const authSearch = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => authSearch.parse(search),
  head: () =>
    seoHead({
      title: "Create profile — YARD",
      description:
        "Create your YARD workspace or sign in. Fail-closed quote checks for everyday buyers.",
      path: "/auth",
    }),
  component: AuthPage,
});
