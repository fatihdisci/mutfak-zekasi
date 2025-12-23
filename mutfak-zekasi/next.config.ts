import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack'in klasörleri doğru bulması için bu ayar bazen kritiktir
  transpilePackages: ["@/components"], 
};

export default nextConfig;