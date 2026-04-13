/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
