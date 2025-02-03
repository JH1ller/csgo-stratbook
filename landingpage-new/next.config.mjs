/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/home',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
