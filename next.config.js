/** @type {import('next').NextConfig} */
const nextConfig = {
  // This rule tells the build process to ignore TypeScript errors.
  typescript: {
    ignoreBuildErrors: true,
  },
  // This NEW rule tells the build process to SKIP the style check (ESLint).
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

