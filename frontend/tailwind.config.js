/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',   // biru utama
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        accent: {
          DEFAULT: '#f1f5f9',   // abu soft untuk background
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
