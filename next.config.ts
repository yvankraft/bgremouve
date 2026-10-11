import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Active crossOriginIsolated → multi-threading WASM (SharedArrayBuffer).
  // "credentialless" évite de casser le chargement du modèle depuis le CDN imgly.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;
