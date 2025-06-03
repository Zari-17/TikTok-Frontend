import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FE2C55",
        "app-gray": "#808080",
        "app-gray-2": "#1F1F1F",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
