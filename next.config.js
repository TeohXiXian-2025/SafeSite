/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/SafeSite' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/SafeSite' : ''
}

module.exports = nextConfig