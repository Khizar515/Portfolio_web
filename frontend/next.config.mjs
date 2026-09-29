/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  async rewrites() {
    // INTERNAL_API_URL = backend reachable FROM the Next.js server process.
    // Docker:    http://backend:5000  (Docker internal DNS, set via build ARG)
    // Local dev: http://localhost:5000 (default fallback)
    const backend = process.env.INTERNAL_API_URL || 'http://localhost:5000';
    return [
      // Browser calls khizar.ksdev.me/api/* → Next.js server proxies to backend
      { source: '/api/:path*',     destination: `${backend}/api/:path*` },
      // Upload images served via same origin (no separate API domain needed)
      { source: '/uploads/:path*', destination: `${backend}/uploads/:path*` },
      { source: '/exports/:path*', destination: `${backend}/exports/:path*` },
    ];
  },

  images: {
    remotePatterns: [
      // Google profile images (still external)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
