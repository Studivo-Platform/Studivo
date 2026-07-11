import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for optimized Docker/VPS deployment
  output: "standalone",

  // Allow dev origins for local network testing
  allowedDevOrigins: ["192.168.1.9", "172.22.48.1"],

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
