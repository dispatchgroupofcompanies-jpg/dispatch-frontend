import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendOrigin = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      (process.env.NODE_ENV === "production"
        ? "https://dispatch-backend-1-ukyv.onrender.com"
        : "http://localhost:5000")
    ).replace(/\/$/, "");

    return [{ source: "/backend/api/:path*", destination: `${backendOrigin}/api/:path*` }];
  },
};

export default nextConfig;
