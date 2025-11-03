import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  /* config options here */
  images: {
    domains: ["picsum.photos",'res.cloudinary.com'],

  },
};

export default nextConfig;
