import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"
import typography from "@tailwindcss/typography"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Mario Theme Colors
        mario: {
          red: "#ff0000",
          blue: "#0066ff",
          green: "#228b22",
          gold: "#ffd700",
          brown: "#8b4513",
          sky: "#87ceeb",
          brick: "#c84c0c",
          pipe: "#2d8b2d",
          question: "#ffcc00",
          ground: "#654321",
        },
        // Base theme
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "coin-spin": {
          "0%, 100%": { transform: "scaleX(1)" },
          "50%": { transform: "scaleX(0.2)" },
        },
        "coin-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "block-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "cloud-drift": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "coin-spin": "coin-spin 1.5s infinite ease-in-out",
        "coin-float": "coin-float 1s infinite ease-in-out",
        "block-bounce": "block-bounce 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "cloud-drift": "cloud-drift 30s linear infinite",
      },
      boxShadow: {
        'pixel': '4px 4px 0 rgba(0,0,0,0.4)',
        'pixel-lg': '6px 6px 0 rgba(0,0,0,0.3)',
        'block': 'inset 4px 4px 0 rgba(255,255,255,0.4), inset -4px -4px 0 rgba(0,0,0,0.2), 4px 4px 0 rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config

export default config
