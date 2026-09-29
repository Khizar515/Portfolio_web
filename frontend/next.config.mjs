/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      // Internal Docker network (container-to-container)
      {
        protocol: "http",
        hostname: "backend",
        port: "5000",
        pathname: "/uploads/**",
      },
      // Production — served via Cloudflare tunnel on api.khizar.ksdev.me
      {
        protocol: "https",
        hostname: "api.khizar.ksdev.me",
        pathname: "/uploads/**",
      },
      // Google profile images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
