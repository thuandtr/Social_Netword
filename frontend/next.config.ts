import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  env: {
    LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL,
    PROD_BACKEND_URL: process.env.PROD_BACKEND_URL,
  },
  experimental: {
    // Increase body size limit for Server Actions to handle file uploads
    serverActions: {
      bodySizeLimit: '10mb', // Match backend's 10MB limit
    },
  },
  images: {
    // Allow images from backend server
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
