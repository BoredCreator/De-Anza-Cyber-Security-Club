export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'Share Tech Mono', 'monospace'],
        terminal: ['Share Tech Mono', 'monospace'],
      },
      colors: {
        matrix: {
          DEFAULT: '#00ff41',
          dim: '#00cc33',
          dark: '#00991f',
          glow: 'rgba(0, 255, 65, 0.6)',
          bg: '#0a0a0a',
        },
        terminal: {
          bg: '#0a0a0a',
          alt: '#0d1117',
          border: '#1a1a1a',
          header: '#2a2a2a',
        },
        hack: {
          red: '#ff0040',
          cyan: '#00ffff',
          yellow: '#ffff00',
          orange: '#ff9500',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 4s infinite',
        'glitch': 'glitch 0.3s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            textShadow: '0 0 5px rgba(0, 255, 65, 0.6), 0 0 10px rgba(0, 255, 65, 0.4)'
          },
          '50%': {
            opacity: '0.8',
            textShadow: '0 0 20px rgba(0, 255, 65, 0.8), 0 0 30px rgba(0, 255, 65, 0.6)'
          },
        },
      },
      boxShadow: {
        'neon': '0 0 5px rgba(0, 255, 65, 0.6), 0 0 10px rgba(0, 255, 65, 0.4), 0 0 20px rgba(0, 255, 65, 0.2)',
        'neon-strong': '0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.6), 0 0 40px rgba(0, 255, 65, 0.4)',
      },
    },
  },
  plugins: [],
}
