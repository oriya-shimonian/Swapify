/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-960px)" },
        },
        scrollReverse: {
          "0%": { transform: "translateX(-960px)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseHighlight: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(59,130,246,0.2)" }, // כחול בהיר
        },
      },
      animation: {
        "scroll-left": "scroll 10s linear infinite",
        "scroll-right": "scrollReverse 10s linear infinite",
        "pulse-highlight": "pulseHighlight 1.5s ease-in-out 2",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
  'text-yellow-600', 'bg-yellow-100',
  'text-pink-600', 'bg-pink-100',
  'text-cyan-600', 'bg-cyan-100',
  'text-indigo-600', 'bg-indigo-100',
  'text-emerald-600', 'bg-emerald-100',
  'text-fuchsia-600', 'bg-fuchsia-100',
  'text-purple-600', 'bg-purple-100',
  'text-teal-600', 'bg-teal-100',
  'text-lime-600', 'bg-lime-100',
  // כל צבע שתשתמש בו דינמית
],

};
