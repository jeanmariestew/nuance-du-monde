/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nuancedumonde.com',
      },
    ],
  },
};

module.exports = nextConfig;

