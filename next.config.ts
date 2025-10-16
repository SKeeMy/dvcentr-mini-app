import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/tg-react-app',
        destination: 'https://dvcentr.ru/api/tg-react-app/',
      },

    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Forwarded-Proto', value: 'https' },
          { key: 'X-Forwarded-Ssl', value: 'on' },
        ],
      },
    ];
  }
};

export default nextConfig;
