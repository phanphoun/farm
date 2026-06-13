import type { NextConfig } from "next";
import path from "path";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../../"),
  serverExternalPackages: ["@next/swc-wasm-nodejs"],
};

export default nextConfig;
