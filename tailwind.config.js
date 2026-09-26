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
        // Brighter small/muted text for ~AA contrast on the purple glass
        'ink-body': '#e4e8fc',
        'ink-muted': '#d2d8f6',
        glass: 'rgba(255, 255, 255, 0.10)',
        'glass-subtle': 'rgba(255, 255, 255, 0.06)',
        'glass-strong': 'rgba(255, 255, 255, 0.16)',
        'glass-line': 'rgba(255, 255, 255, 0.22)',
        night: {
          DEFAULT: '#1c1240',
          deep: '#150d31',
        },
      },
      fontSize: {
        // Calmer reading rhythm (UX brief: raise line-height)
        sm: ['0.875rem', { lineHeight: '1.4rem' }],
        base: ['1rem', { lineHeight: '1.7rem' }],
        lg: ['1.125rem', { lineHeight: '1.85rem' }],
      },
      borderRadius: {
        card: '1.25rem',
      },
      boxShadow: {
        card: '0 16px 36px rgba(10, 6, 30, 0.22)',
        'card-hover': '0 22px 44px rgba(10, 6, 30, 0.30)',
        glow: '0 8px 32px rgba(94, 139, 253, 0.35)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3d1c5b 0%, #1a73e8 100%)',
      },
    },
  },
  plugins: [],
};
