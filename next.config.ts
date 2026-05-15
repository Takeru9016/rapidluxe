import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: false, // Enable after backend wired
  },
};

export default nextConfig;
