import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Since images are in the public folder, no need to configure domains
    // But we can optimize them
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
