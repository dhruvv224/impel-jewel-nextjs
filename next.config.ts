/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Skip ESLint checks during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Ignore TypeScript build errors (not recommended for production)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
