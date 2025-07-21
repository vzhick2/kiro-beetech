import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Production optimizations only
  poweredByHeader: false,
  compress: true,

  // Build performance improvements
  experimental: {
    optimizePackageImports: [
      'ag-grid-community',
      'ag-grid-react',
      '@radix-ui/react-icons',
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverActions: {
      allowedOrigins: ['http://localhost:3000', 'https://your-production-domain.com'],
    },
  },

  // Image optimization
  images: {
    unoptimized: false, // Enable for production
  },

  // Compiler optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // TypeScript and ESLint - optimized for faster builds
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
