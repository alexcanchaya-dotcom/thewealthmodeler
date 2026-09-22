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
        primary: {
          DEFAULT: '#5e8bfd',
          strong: '#4a7de8',
        },
        secondary: '#34d399',
        background: '#1e1442',
        text: '#f5f7ff',
        'ink-body': '#d6dbf5',
        'ink-muted': '#aeb6dd',
        glass: 'rgba(255, 255, 255, 0.10)',
        'glass-subtle': 'rgba(255, 255, 255, 0.06)',
        'glass-strong': 'rgba(255, 255, 255, 0.16)',
        'glass-line': 'rgba(255, 255, 255, 0.22)',
        night: {
          DEFAULT: '#1c1240',
          deep: '#150d31',
        },
      },
      boxShadow: {
        card: '0 20px 40px rgba(10, 6, 30, 0.35)',
        'card-hover': '0 28px 56px rgba(10, 6, 30, 0.45)',
        glow: '0 8px 32px rgba(94, 139, 253, 0.35)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3d1c5b 0%, #1a73e8 100%)',
      },
    },
  },
  plugins: [],
};
