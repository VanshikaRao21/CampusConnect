/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    const path = require('path');
    config.cache = false;
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      ...(config.resolve.modules || []),
    ];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      rxjs: path.resolve(__dirname, 'node_modules/rxjs'),
    };
    return config;
  },
};

module.exports = nextConfig;
