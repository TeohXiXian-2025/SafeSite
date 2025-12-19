/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/SafeSite',
  assetPrefix: '/SafeSite/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig