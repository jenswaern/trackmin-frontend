/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiBaseUrl: process.env.API_URL,
    apiUrlV1: `/v1`,
  },
  images: {
    domains: [
      "localhost",
      "develop--knowville.netlify.app",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.API_DOMAIN,
        port: process.env.API_PORT,
        pathname: "/storage/**",
      },
    ],
  },
  rewrites: async () => [
    {
      source: "/api/v1/:path*",
      destination: `${process.env.API_URL}/v1/:path*`,
    },
    {
      source: "/storage/:path*",
      destination: `${process.env.STORAGE_URL}/:path*`, // Ensure this points to the correct storage URL
    },
  ],
};

module.exports = nextConfig;
