/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Generate a completely static site (no Lambda functions)
  output: 'export',

  // ✅ Ignore TypeScript and ESLint build errors (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Disable Next.js image optimization (required for static export)
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
