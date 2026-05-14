/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Webpack instead of Turbopack for compatibility
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;
