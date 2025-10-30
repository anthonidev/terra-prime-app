import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BACKENDL_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },

  // Configure dev indicators position
  devIndicators: {
    position: 'bottom-right',
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**'
      },
      //amazon s3
      {
        protocol: 'https',
        hostname: 'inmobiliariahuertas-files-2025-dev.s3.us-east-2.amazonaws.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'inmobiliariahuertas-files-2025.s3.us-east-2.amazonaws.com',
        pathname: '**'
      }
    ],
    localPatterns: [
      {
        pathname: '/imgs/**'
      }
    ]
  }
};

export default nextConfig;
