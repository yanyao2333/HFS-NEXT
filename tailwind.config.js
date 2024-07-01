/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {},
    },
    darkMode: "selector",
    plugins: [
        require("tailwindcss-animate")
    ],
}
