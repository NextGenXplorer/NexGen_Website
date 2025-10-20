/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Generate static site (no server-side rendering)
  output: 'export',

  // ✅ Ignore TypeScript and ESLint build errors (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Disable image optimization (required for static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
