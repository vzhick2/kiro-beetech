/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable, no need for experimental flag
  // Temporarily disable React Compiler to fix compilation issues
  experimental: {
    // reactCompiler: true,
  },
}

module.exports = nextConfig