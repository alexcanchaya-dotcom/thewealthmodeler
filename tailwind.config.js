/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Calm finance tokens — soft navy + muted teal (not Longevity purple)
        primary: '#1e4a6e',
        secondary: '#2f7a78',
        accent: '#3d8b88',
        background: '#f3f6f8',
        mist: '#e8eef2',
        text: '#1a2b3c',
        muted: '#5b6b7c'
      },
      boxShadow: {
        card: '0 8px 28px rgba(26, 43, 60, 0.06)',
        soft: '0 4px 16px rgba(26, 43, 60, 0.04)'
      },
      borderRadius: {
        card: '1.125rem'
      },
      backgroundImage: {
        // Quiet wash only — not a loud blue→teal bar
        'gradient-primary': 'linear-gradient(180deg, #f7fafb 0%, #eef3f6 100%)',
        'gradient-hero': 'linear-gradient(145deg, rgba(61, 139, 136, 0.08), rgba(30, 74, 110, 0.06))'
      }
    }
  },
  plugins: []
};
