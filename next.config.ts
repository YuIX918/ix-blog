// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // もし reactStrictMode: true などの設定が既にあれば、
    // この images: { ... } の部分をカンマ(,)で区切って追記してください。

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.microcms-assets.io',
                port: '',
                pathname: '/**', // images.microcms-assets.io 以下のすべての画像を許可
            },
        ],
    },
};

export default nextConfig;