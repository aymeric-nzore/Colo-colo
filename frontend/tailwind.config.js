/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        acad: {
          primary: '#f97316',
          'primary-content': '#020617',
          secondary: '#0f172a',
          accent: '#38bdf8',
          neutral: '#0b1120',
          'base-100': '#020617',
          'base-200': '#020617',
          'base-300': '#111827',
          info: '#38bdf8',
          success: '#22c55e',
          warning: '#facc15',
          error: '#ef4444',
        },
      },
      'dark',
    ],
    darkTheme: 'acad',
  },
}


