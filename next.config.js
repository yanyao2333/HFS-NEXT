/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yj-oss.yunxiao.com",
      },
    ],
  },
  experimental: {},
  env: {
    URL: "http://localhost:3000",
  },
};

module.exports = nextConfig;
