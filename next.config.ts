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
};

export default nextConfig;
