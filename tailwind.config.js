/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fb',
          100: '#d4e0f4',
          200: '#a9c1e8',
          300: '#6f97d6',
          400: '#3f6fbd',
          500: '#2a519e',
          600: '#1e3d7a',
          700: '#1a3263',
          800: '#172a52',
          900: '#14213d',
          950: '#0c1628',
        },
        teal: {
          50: '#effcf9',
          100: '#cbf7ef',
          200: '#97ede0',
          300: '#5edcca',
          400: '#2cc4b0',
          500: '#14a896',
          600: '#0c8779',
          700: '#106c62',
          800: '#135651',
          900: '#134744',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(20 33 61 / 0.04), 0 4px 16px -2px rgb(20 33 61 / 0.06)',
        'soft-lg': '0 2px 4px 0 rgb(20 33 61 / 0.05), 0 12px 32px -4px rgb(20 33 61 / 0.10)',
      },
    },
  },
  plugins: [],
};
