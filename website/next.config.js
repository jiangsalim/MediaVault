/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['i.ytimg.com', 'img.youtube.com'] },
  async headers() {
    return [{ source: '/api/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
  }
};
module.exports = nextConfig;
