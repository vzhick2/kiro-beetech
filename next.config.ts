import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Production optimizations only
  poweredByHeader: false,
  compress: true,

  // Exclude prototype directory from build
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
      allowedOrigins: [
        'http://localhost:3000',
        'https://your-production-domain.com',
      ],
    },
  },

  // Exclude prototype from compilation
  webpack: config => {
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /prototype-features-pages/,
    });
    return config;
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
