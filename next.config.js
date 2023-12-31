/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dummyimage.com']
  },
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL + '/api/:path*'
      },
      {
        source: '/uploads/:path*',
        destination: process.env.API_URL + '/uploads/:path*'
      }
    ]
  }
}

module.exports = nextConfig
