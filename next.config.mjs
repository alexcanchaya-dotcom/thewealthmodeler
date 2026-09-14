/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Live PHP pages use trailing slashes (/about/, /privacy/). Serve the same here
  // so /fire/, /retirement/, /about/, /privacy/, and /contact/ do not 404.
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/fire-calculator',
        destination: '/calculators/fire/',
        permanent: false,
      },
      {
        source: '/retirement-calculator',
        destination: '/calculators/retirement/',
        permanent: false,
      },
      {
        source: '/compound-interest-calculator',
        destination: '/calculators/compound-interest/',
        permanent: false,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy/',
        permanent: false,
      },
      {
        source: '/contact-us',
        destination: '/contact/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
