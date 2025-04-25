/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yj-oss.yunxiao.com',
      },
    ],
  },
  experimental: {},
  env: {
    URL: 'https://hfs.uselesslab.top/',
  },
}

module.exports = nextConfig
