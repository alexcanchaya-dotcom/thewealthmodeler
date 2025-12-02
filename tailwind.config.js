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
        primary: '#2563eb',
        secondary: '#10b981',
        background: '#f9fafb',
        text: '#1f2937'
      },
      boxShadow: {
        card: '0 10px 30px rgba(0, 0, 0, 0.07)'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb, #10b981)'
      }
    }
  },
  plugins: []
};
