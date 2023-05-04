/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'sb-white': '#F3F3F1',
        'sb-dark-blue': '#182D6E',
      },
      textColor: {
        'sb-white': '#F3F3F1',
        'sb-dark-blue': '#182D6E',
        'sb-light-blue': '#346FBB',
      },
      fontFamily: {
        'inter': ["Inter","游ゴシック体", "YuGothic", "游ゴシック", "Yu Gothic", "sans-serif"],
      },
    },
  },
  plugins: [],
}
