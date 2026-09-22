import { ConvexReactClient } from "convex/react";

const url = import.meta.env.VITE_CONVEX_URL;
if (!url) {
  console.warn("VITE_CONVEX_URL is not set — Convex client will fail until configured.");
}

export const convex = new ConvexReactClient(url ?? "http://127.0.0.1:3210");
