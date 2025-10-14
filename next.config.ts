import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  // Optimize page transitions - no loading delay
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  // Disable automatic static optimization for smoother transitions
  reactStrictMode: true,
  /* config options here */
};

export default nextConfig;
