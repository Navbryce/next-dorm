const colors = require('tailwindcss/colors')

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: colors.slate,
                secondary: {
                    50: "#d5e8ec",
                    100: "#a9d2da",
                    200: "#75bdca",
                    300: "#5fa4b0",
                    400: "#508b95",
                    500: "#42737b",
                    600: "#355b62",
                    700: "#28454a",
                    800: "#1b3033",
                    900: "#101c1e",
                },
            },
        }
    },
    darkMode: "class",
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    }
}
