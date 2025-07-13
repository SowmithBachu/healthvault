/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'modal-pop': 'modalPop 0.5s cubic-bezier(.22,1,.36,1)',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'float-slower': 'float-slower 18s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2.5s infinite',
        'ping-slow': 'ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite',
        'glow-btn': 'glowBtn 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.7s ease',
      },
      keyframes: {
        modalPop: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-32px)' }
        },
        'float-slower': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-48px)' }
        },
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'ping-slow': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        },
        glow: {
          '0%, 100%': { filter: 'blur(4px) brightness(1.1)' },
          '50%': { filter: 'blur(8px) brightness(1.3)' }
        },
        glowBtn: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
} 