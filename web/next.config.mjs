/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'awaasdirect-assets.s3.ap-south-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    },
};

export default nextConfig;
