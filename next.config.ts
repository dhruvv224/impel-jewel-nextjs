/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint checks during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript build errors (not recommended for production)
    ignoreBuildErrors: true,
  },
  experimental: {
    // ✅ Prevent Turbopack from being used during the Vercel build
    turbo: false,
  },
};

module.exports = nextConfig;
