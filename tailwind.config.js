/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Garamond', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          ink: '#17130F',
          paper: '#F6F1E9',
          sand: '#EDE5D8',
          gold: '#8A6630',
          'gold-light': '#C9A66B',
          night: '#15110D',
        },
      },
    },
  },
  plugins: [],
};
