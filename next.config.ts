import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export',
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dvcentr.ru/api/:path*',
      },
    ];
  }
  
};

export default nextConfig;
