import type { NextConfig } from "next";

const NEXUS_API_URL = process.env.NEXUS_API_URL ?? "http://192.168.1.109:3500";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${NEXUS_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
