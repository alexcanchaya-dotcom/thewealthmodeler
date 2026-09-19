/** @type {import('next').NextConfig} */

// Live PHP aliases that must keep working after DNS points at Vercel.
// Query strings (Tax→FIRE utm handoff) are forwarded by Next automatically.
const legacyAliases = [
  { source: '/fire-calculator', destination: '/calculators/fire' },
  { source: '/retirement-calculator', destination: '/calculators/retirement' },
  { source: '/compound-interest-calculator', destination: '/calculators/compound-interest' },
  { source: '/privacy-policy', destination: '/privacy' },
];

function withAndWithoutSlash({ source, destination }) {
  const noSlash = source.replace(/\/$/, '');
  return [
    { source: noSlash, destination, permanent: true },
    { source: `${noSlash}/`, destination, permanent: true },
  ];
}

const nextConfig = {
  reactStrictMode: true,
  // Intentional: keep current no-slash URLs (e.g. /calculators/fire).
  trailingSlash: false,
  async redirects() {
    return legacyAliases.flatMap(withAndWithoutSlash);
  },
};

export default nextConfig;
