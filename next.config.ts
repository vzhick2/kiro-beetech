import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack configuration (now stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Development optimizations
  experimental: {
    // Optimize for development speed
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Reduce verbose logging in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Webpack optimizations for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Faster source maps in development
      config.devtool = 'eval-cheap-module-source-map'
      
      // Optimize bundle splitting for development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }
    return config
  },

  // TypeScript optimization
  typescript: {
    // Don't run type checking during development for speed
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // ESLint optimization
  eslint: {
    // Don't run ESLint during development for speed
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },

  // Image optimization
  images: {
    // Disable image optimization in development for speed
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Compiler optimization
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
