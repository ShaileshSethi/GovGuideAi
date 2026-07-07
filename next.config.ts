import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript and ESLint errors during Vercel build to ensure smooth deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure that dynamic files read via fs are included in the Vercel serverless bundle
  outputFileTracingIncludes: {
    '/api/generate': ['./data/**/*.json', './SYSTEM.MD'],
  },
};

export default nextConfig;
