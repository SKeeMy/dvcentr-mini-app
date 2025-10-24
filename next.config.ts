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
      {
        source: '/api/tg-react-app/check-user',
        destination: 'https://dvcentr.ru/api/tg-react-app/check-user',
      },
      {
        source: '/api/tg-react-app/get-order-phone',
        destination: 'https://dvcentr.ru/api/tg-react-app/get-order-phone',
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
          { key: 'HTTPS', value: 'YES' },
          { key: 'X-Requested-With', value: 'XMLHttpRequest' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Если нужен CORS
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  }
};

export default nextConfig;
