/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ Explicitly disable turbopack
  experimental: {
    turbo: false,
  },
  webpack: (config) => {
    // ✅ Ensure webpack is used
    return config;
  },
};

module.exports = nextConfig;
