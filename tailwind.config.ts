import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d631b",
          foreground: "#ffffff",
          fixed: "#a3f69c",
          "fixed-dim": "#88d982",
          container: "#2e7d32",
          "on-container": "#cbffc2",
        },
        secondary: {
          DEFAULT: "#4c616c",
          foreground: "#ffffff",
          fixed: "#cfe6f2",
          "fixed-dim": "#b4cad6",
          container: "#cfe6f2",
          "on-container": "#526772",
        },
        tertiary: {
          DEFAULT: "#774c00",
          foreground: "#ffffff",
          fixed: "#ffddb5",
          "fixed-dim": "#ffb957",
          container: "#986200",
          "on-container": "#ffeede",
        },
        surface: {
          DEFAULT: "#fbf9f9",
          dim: "#dbdad9",
          tint: "#1b6d24",
          variant: "#e3e2e2",
          container: {
            DEFAULT: "#efeded",
            lowest: "#ffffff",
            low: "#f5f3f3",
            high: "#e9e8e7",
            highest: "#e3e2e2",
          },
        },
        error: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
          container: "#ffdad6",
          "on-container": "#93000a",
        },
        outline: {
          DEFAULT: "#707a6c",
          variant: "#bfcaba",
        },
        "on-surface": "#1b1c1c",
        "on-surface-variant": "#40493d",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#002204",
        "on-primary-fixed-variant": "#005312",
        "on-secondary-fixed": "#071e27",
        "on-tertiary-fixed": "#2a1800",
        "on-tertiary-container": "#ffeede",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f3",
        "surface-container": "#efeded",
        "surface-container-high": "#e9e8e7",
        "surface-container-highest": "#e3e2e2",
        // shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ['"Public Sans"', "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
