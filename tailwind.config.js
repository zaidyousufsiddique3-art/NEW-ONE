/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#030712',
                    cyan: '#00E7FF',
                    purple: '#7B4DFF',
                    blue: '#4FDFFF',
                }
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 231, 255, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 231, 255, 0.6), 0 0 10px rgba(0, 231, 255, 0.4)' },
                }
            }
        },
    },
    plugins: [],
}
