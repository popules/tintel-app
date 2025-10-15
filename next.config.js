/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! DANGER !!
    // This allows your project to build even if it has type errors.
    // We are using this as a diagnostic tool.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

