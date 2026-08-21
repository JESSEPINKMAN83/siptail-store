/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@wix/sdk", "@wix/stores", "@wix/ecom"],
  },
};

export default nextConfig;
