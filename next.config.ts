import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Production optimizations only
  poweredByHeader: false,
  compress: true,

  // Image optimization
  images: {
    unoptimized: false, // Enable for production
  },

  // Compiler optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // TypeScript and ESLint - let Vercel handle these
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint warnings during builds for now
  },
};

export default nextConfig;