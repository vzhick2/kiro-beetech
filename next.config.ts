import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Development optimizations
  experimental: {
    // Faster development builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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

  // Development server optimizations
  devIndicators: {
    buildActivity: false, // Disable build activity indicator for speed
  },

  // Experimental features for better performance
  swcMinify: true,
}

export default nextConfig
