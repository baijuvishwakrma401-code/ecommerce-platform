import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// WHITE THEME DESIGN TOKENS
// These are the *default* values. In later phases these will be overridden
// at runtime by values coming from the `website_settings` table (Section 12
// / 27 of the spec) so a non-technical admin can restyle the site without
// touching this file. For now they define the static Phase 1 look.
// ---------------------------------------------------------------------------
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces — pure, warm white (never stark #fff-on-#fff, always
        // a hint of warmth so cards/edges read against the page)
        surface: {
          DEFAULT: "#ffffff",
          muted: "#faf9f7",
          subtle: "#f3f1ed",
          border: "#e7e4dd",
        },
        ink: {
          DEFAULT: "#171512",
          soft: "#4a4640",
          muted: "#847e73",
        },
        // Single confident accent — deep clay/terracotta. Configurable later
        // via admin "Primary color" setting.
        accent: {
          DEFAULT: "#b5502e",
          hover: "#9c4126",
          soft: "#f6e6de",
        },
        success: "#2f6f4e",
        warning: "#b7791e",
        danger: "#b3261e",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,21,18,0.04), 0 8px 24px -12px rgba(23,21,18,0.10)",
        pop: "0 12px 32px -8px rgba(23,21,18,0.18)",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};

export default config;
