/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
            },
            {
                protocol: "https",
                hostname: "yj-oss.yunxiao.com"
            }
        ],
    },
}

module.exports = nextConfig
