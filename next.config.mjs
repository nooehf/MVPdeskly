/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimización para Serverless Functions en Vercel
  experimental: {
    serverComponentsExternalPackages: ['googleapis', '@hubspot/api-client'],
  },
};

export default nextConfig;
