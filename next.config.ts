import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Our animated sections are client components; keep builds green while the
  // Vite-era eslint config is migrated separately.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
