import type { NextConfig } from "next";
import { env } from "process";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const serverUrl = 'https://dev.ecsdv.ru'
    // const serverUrl = 'https://dvcentr.ru'
    return [
      {
        source: '/api/tg-react-app',
        destination: `${serverUrl}/api/tg-react-app/`,
      },
      {
        source: '/api/tg-react-app/check-user',
        destination: `${serverUrl}/api/tg-react-app/check-user/`,
      },
      {
        source: '/api/tg-react-app/get-order-phone',
        destination: `${serverUrl}/api/tg-react-app/get-order-phone/`,
      },
      {
        source: '/api/tg-react-app/register-user',
        destination: `${serverUrl}/api/tg-react-app/register-user/`,
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
