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
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
}

module.exports = nextConfig
