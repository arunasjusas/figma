/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A61C4',
          hover: '#084FA3',
        },
        status: {
          paid: '#10B981',
          unpaid: '#EF4444',
          pending: '#0A61C4',
        },
        chart: {
          green: '#12E100',
          purple: '#664DFF',
          blue: '#2B66FF',
        },
        neutral: {
          bg: '#F9FAFB',
          border: '#E5E7EB',
          borderDark: '#D1D5DB',
        },
        pill: {
          bg: '#EEF6FF',
          text: '#075985',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'header': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

