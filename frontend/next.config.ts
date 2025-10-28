import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  env: {
    LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL,
  }
};

export default nextConfig;
