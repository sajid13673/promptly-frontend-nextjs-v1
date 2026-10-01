import type { NextConfig } from "next";

const BACKEND_URL = process.env.API_BASE;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not set");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;