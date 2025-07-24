module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'secondary': '#10b981',
        'accent': '#8b5cf6',
        'danger': '#ef4444',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}