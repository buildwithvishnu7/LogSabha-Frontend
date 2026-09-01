import type { NextConfig } from "next";

// STATIC_EXPORT=1 switches the build to a fully static one, used to produce the
// shareable standalone homepage in reference/. It is env-gated so `next dev`
// and the normal build are completely unaffected.
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Our animated sections are client components; keep builds green while the
  // Vite-era eslint config is migrated separately.
  eslint: { ignoreDuringBuilds: true },

  ...(isExport
    ? {
        output: "export" as const,
        // No image optimisation server exists in a static export.
        images: { unoptimized: true },
        // No assetPrefix: next/font rejects a relative one. The absolute
        // /_next/ paths are rewritten when the page is flattened into a single
        // HTML file instead.
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
