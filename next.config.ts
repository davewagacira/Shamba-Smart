import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // ship the ONNX models and the Linux onnxruntime binary (loaded by a dynamic path, so not auto-traced)
  outputFileTracingIncludes: {
    "/api/*": ["./models/**/*", "./node_modules/onnxruntime-node/bin/napi-v6/linux/x64/**/*"],
  },
  // old paths from the first release
  redirects() {
    return [
      { source: "/recommend", destination: "/crop-advisor", permanent: true },
      { source: "/yield", destination: "/yield-forecast", permanent: true },
      { source: "/insights", destination: "/how-it-works", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
