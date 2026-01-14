import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#fffef7',
                    100: '#fff8dc',
                    200: '#ffe4b5',
                    300: '#ffd700',
                    400: '#daa520',
                    500: '#b8860b',
                    600: '#996515',
                    700: '#7a5012',
                    800: '#5c3c0e',
                    900: '#3d280a',
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
