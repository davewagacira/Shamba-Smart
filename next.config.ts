import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // ship the ONNX models and the Linux onnxruntime binary (loaded by a dynamic path, so not auto-traced)
  outputFileTracingIncludes: {
    "/api/*": ["./models/**/*", "./node_modules/onnxruntime-node/bin/napi-v6/linux/x64/**/*"],
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
