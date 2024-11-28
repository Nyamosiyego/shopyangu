import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all hostnames
      },
    ],
  },
  eslint: {
    // Disables ESLint during builds
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
