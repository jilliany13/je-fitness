/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'confetti': 'confetti 0.5s ease-out',
        'basketball-bounce': 'basketball-bounce 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'volleyball-net': 'volleyball-net 2s ease-in-out infinite',
        'gym-lift': 'gym-lift 1.5s ease-in-out infinite',
        'bowling-roll': 'bowling-roll 2.5s ease-in-out infinite',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'basketball-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-60px) scale(1.1)' },
        },
        'volleyball-net': {
          '0%': { transform: 'translateX(-40px) translateY(-20px) rotate(-15deg)' },
          '25%': { transform: 'translateX(0px) translateY(-40px) rotate(0deg)' },
          '50%': { transform: 'translateX(40px) translateY(-20px) rotate(15deg)' },
          '75%': { transform: 'translateX(0px) translateY(-40px) rotate(0deg)' },
          '100%': { transform: 'translateX(-40px) translateY(-20px) rotate(-15deg)' },
        },
        'gym-lift': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '25%': { transform: 'translateY(-10px) scale(1.05)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
          '75%': { transform: 'translateY(-10px) scale(1.05)' },
        },
        'bowling-roll': {
          '0%': { transform: 'translateX(-60px) translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-20px) translateY(-5px) rotate(90deg)' },
          '50%': { transform: 'translateX(20px) translateY(0) rotate(180deg)' },
          '75%': { transform: 'translateX(60px) translateY(-5px) rotate(270deg)' },
          '100%': { transform: 'translateX(100px) translateY(0) rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
} 