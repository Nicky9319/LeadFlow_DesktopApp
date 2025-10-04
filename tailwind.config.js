/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/widget/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease forwards',
        'slideDown': 'slideDown 0.3s ease',
        'pulse': 'pulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          'to': { opacity: '1' }
        },
        slideDown: {
          'from': { 
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        pulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)'
          }
        }
      },
      maxWidth: {
        '4/5': '80%',
      }
    },
  },
  plugins: [],
}
