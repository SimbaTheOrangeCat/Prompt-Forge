import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Prompt-Forge',
  images: { unoptimized: true },
};

export default nextConfig;
