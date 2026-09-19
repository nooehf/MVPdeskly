/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimización para Serverless Functions en Vercel
  experimental: {
    serverComponentsExternalPackages: ['googleapis', '@hubspot/api-client'],
  },
  webpack: (config, { dev }) => {
    // Evita problemas de bloqueo de archivos en OneDrive en Windows durante desarrollo
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
