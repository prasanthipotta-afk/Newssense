export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dbeafe',
          500: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 15px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
