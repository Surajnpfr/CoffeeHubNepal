/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      },
      colors: {
        coffee: {
          dark: '#3E2723',
          beige: '#D7CCC8',
          brown: '#6F4E37',
          light: '#EBE3D5',
          cream: '#F5EFE6',
          bg: '#F8F5F2',
        },
        green: {
          primary: '#3A7D44',
        },
      },
    },
  },
  plugins: [],
}

