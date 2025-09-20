import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // {
      //   protocol: "https",
      //   hostname: "*.cdninstagram.com",
      // }
    ],
  }
};

export default nextConfig;
