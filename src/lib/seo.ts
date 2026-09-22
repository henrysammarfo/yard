/** Absolute public site URL used for OG / Twitter / canonical tags. */
export const SITE_ORIGIN =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_CONVEX_SITE_URL) ||
  "https://brainy-horse-649.convex.site";

const DEFAULT_OG = `${SITE_ORIGIN}/og.png`;
const DEFAULT_ICON = `${SITE_ORIGIN}/logo.png`;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

const ASSET_V = "v3";

export function seoHead({
  title,
  description,
  path = "/",
  image = DEFAULT_OG,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: "YARD" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "YARD" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "YARD — quote control, live" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
      { name: "twitter:image:alt", content: "YARD — quote control, live" },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", href: `/favicon-32.png?${ASSET_V}`, type: "image/png", sizes: "32x32" },
      { rel: "icon", href: `/favicon-16.png?${ASSET_V}`, type: "image/png", sizes: "16x16" },
      { rel: "shortcut icon", href: `/favicon.ico?${ASSET_V}` },
      { rel: "icon", href: `/favicon.ico?${ASSET_V}`, sizes: "any" },
      { rel: "icon", href: `/favicon.svg?${ASSET_V}`, type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: `/apple-touch-icon.png?${ASSET_V}`, sizes: "180x180" },
      { rel: "image_src", href: `${DEFAULT_ICON}?${ASSET_V}` },
    ],
  };
}
