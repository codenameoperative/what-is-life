/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#060608',
        twilight: '#0e101d',
        nebula: '#2f2b59',
        aurora: '#6b4dff',
        plasma: '#ff71c6',
        synth: '#3bffd7',
        ember: '#ff944d',
        glow: 'rgba(59,255,215,0.35)'
      },
      borderRadius: {
        xl: '1.1rem',
        '2xl': '1.75rem',
        pill: '999px'
      },
      fontFamily: {
        sans: [
          'Inter',
          'Lexend',
          'Sora',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Noto Sans',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        soft: '0 18px 42px rgba(0, 0, 0, 0.38)',
        neon: '0 0 35px rgba(59,255,215,0.25)',
        plasma: '0 15px 45px rgba(255,113,198,0.35)'
      },
      backgroundImage: {
        aurora: 'radial-gradient(circle at 20% 20%, rgba(255,113,198,0.12), transparent 60%), radial-gradient(circle at 80% 10%, rgba(59,255,215,0.1), transparent 55%), radial-gradient(circle at 50% 80%, rgba(107,77,255,0.15), transparent 60%)'
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        float: 'float 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.75 },
          '50%': { opacity: 1 }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}
