import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../../"),
  serverExternalPackages: ["@next/swc-wasm-nodejs"],
};

export default nextConfig;
