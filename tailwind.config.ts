import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sage: {
          DEFAULT: "var(--sage)",
          foreground: "var(--sage-foreground)",
          50: "hsl(140, 20%, 97%)",
          100: "hsl(140, 20%, 90%)",
          200: "hsl(140, 20%, 83%)",
          300: "hsl(140, 20%, 76%)",
          400: "hsl(140, 20%, 69%)",
          500: "var(--sage)",
          600: "hsl(140, 20%, 55%)",
          700: "hsl(140, 20%, 45%)",
          800: "hsl(140, 20%, 35%)",
          900: "hsl(140, 20%, 25%)",
        },
        coral: {
          DEFAULT: "var(--coral)",
          foreground: "var(--coral-foreground)",
          50: "hsl(14, 86%, 96%)",
          100: "hsl(14, 86%, 90%)",
          200: "hsl(14, 86%, 83%)",
          300: "hsl(14, 86%, 76%)",
          400: "hsl(14, 86%, 69%)",
          500: "var(--coral)",
          600: "hsl(14, 86%, 66%)",
          700: "hsl(14, 86%, 56%)",
          800: "hsl(14, 86%, 46%)",
          900: "hsl(14, 86%, 36%)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
