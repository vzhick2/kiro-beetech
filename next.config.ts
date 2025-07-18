import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic optimizations (experimental)
  experimental: {
    reactCompiler: true,
    // Enable enhanced security for Server Actions
    serverActions: {
      allowedOrigins: ['localhost:3001', '0.0.0.0:3001'],
    },
    // Note: unstable_after might not be available in all TypeScript definitions yet
    // We'll use our fallback implementation for now
  },
  // Enable TypeScript support
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  // Enable ESLint checking during build
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
