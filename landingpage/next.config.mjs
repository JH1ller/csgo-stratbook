/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/home',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
