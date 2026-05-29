import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  serverExternalPackages: ["pino", "pino-pretty"],
  turbopack: {
    resolveConditions: ["node", "require", "default"],
  },
};

export default nextConfig;
