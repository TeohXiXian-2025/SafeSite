/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Only use basePath for production (GitHub Pages), not for local development
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/SafeSite',
    assetPrefix: '/SafeSite/',
  })
}

module.exports = nextConfig