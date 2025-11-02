// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#F5F4FF',
          300: '#D8D4FF',
          500: '#BBB4FF',
          700: '#978DFF',
        },
        neutral: {
          50:  '#F7F8FA',
          200: '#E8E9EC',
          300: '#D2D2D2',
          400: '#B3B3B3',
          650: '#59595B', // 커스텀 스텝
          700: '#4B4B4B',
          900: '#121212',
          white: '#FFFFFF',
        },
        pink: { 300: '#0b0103ff' },
        sky: { 300: '#AFC8F0' },
        purple: { 200: '#D6D0FC' },
        'brand-from':'#777BF9',
        'brand-to':'#DBB6E1',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'Apple SD Gothic Neo', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
