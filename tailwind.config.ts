import type { Config } from 'tailwindcss/nuxt'

export default <Config> {
  theme: {
    extend: {
      colors: {
        bg: '#0d0d0d',
        'card-bg': '#1a1a1a',
        primary: '#009688',
        'primary-hover': '#00796b',
        'primary-dark': '#004d40',
        'text-main': '#ffffff',
        'text-muted': '#a0a0a0',
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'lg': '24px',
        'md': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'reveal-right': 'revealRight 0.8s ease forwards',
        'reveal-left': 'revealLeft 0.8s ease forwards',
        'scale-up': 'scaleUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'ghost-fade': 'ghostFade 0.4s forwards',
        'puzzle-float': 'puzzleFloat 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'isagi-glow': 'isagiGlow 0.1s infinite alternate',
        'tremble': 'tremble 0.05s infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        revealRight: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        revealLeft: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleUp: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        ghostFade: {
          'from': { opacity: '0.6', transform: 'var(--current-transform) scale(1)' },
          'to': { opacity: '0', transform: 'var(--current-transform) scale(1.2)', filter: 'blur(10px)' },
        },
        puzzleFloat: {
          '0%': { opacity: '0', transform: 'scale(0.5) rotate(var(--rotate-start)) translate(0, 0)' },
          '20%': { opacity: '1', transform: 'scale(1) rotate(var(--rotate-start)) translate(0, 0)' },
          '100%': { opacity: '0', transform: 'scale(0.7) rotate(var(--rotate-end)) translate(var(--drift-x), -300px)' },
        },
        isagiGlow: {
          '0%': { filter: 'brightness(1) contrast(1.1)' },
          '100%': { filter: 'brightness(1.3) contrast(1.2)', transform: 'var(--current-transform) scale(1.01)' },
        },
        tremble: {
          '0%, 100%': { transform: 'var(--current-transform) translateY(1px)' },
          '25%': { transform: 'var(--current-transform) translateY(-2px)' },
          '50%': { transform: 'var(--current-transform) translateY(2px)' },
          '75%': { transform: 'var(--current-transform) translateY(-1px)' },
        },
      },
    },
  },
}

