import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
}

export default nextConfig;
