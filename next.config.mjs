/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force cache clear
  generateBuildId: async () => {
    return Date.now().toString()
  },
}

export default nextConfig
