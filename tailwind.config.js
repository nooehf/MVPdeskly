/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        deskly: {
          bg: '#080E1E',
          card: '#0D1730',
          cardHover: '#132145',
          border: '#1B2C5B',
          blue: '#1A6BFF',
          blueHover: '#337EFF',
          blueDark: '#0052E0',
          blueLight: '#E8F1FF',
          accent: '#2B7FFF',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1a6bff',
          600: '#1457d9',
          700: '#0f44b0',
        },
        surface: {
          800: '#101B38',
          900: '#0A1227',
          950: '#060B18',
        },
      },
    },
  },
  plugins: [],
};
