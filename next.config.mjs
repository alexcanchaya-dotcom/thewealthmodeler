/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Intentional: keep current no-slash URLs (e.g. /calculators/fire).
  trailingSlash: false,
};

export default nextConfig;
