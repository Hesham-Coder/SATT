import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseTrustedDomains() {
  const rawValue =
    process.env.NEXT_PUBLIC_TRUSTED_IMAGE_DOMAINS || process.env.TRUSTED_IMAGE_DOMAINS || "";

  const defaults = ["localhost", "127.0.0.1"];
  const parsed = rawValue
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...defaults, ...parsed]));
}

const trustedImageDomains = parseTrustedDomains();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: trustedImageDomains.flatMap((hostname) => [
      { protocol: "https", hostname },
      { protocol: "http", hostname },
    ]),
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
