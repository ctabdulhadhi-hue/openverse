import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hosting mode (static export vs. Firebase App Hosting) is decided before
  // Phase 24/31. Until then the default Next.js server output is used.
};

export default nextConfig;
