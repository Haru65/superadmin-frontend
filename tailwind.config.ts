import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102235',
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          500: '#1687d9',
          600: '#0e71bc',
          700: '#0c5a96',
          900: '#133a5c',
        },
      },
      boxShadow: {
        panel: '0 12px 40px rgba(15, 34, 53, 0.07)',
      },
    },
  },
  plugins: [animate],
} satisfies Config
