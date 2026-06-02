// ┌─────────────────────────────────────────────────────┐
// │  GLOBAL THEME — Single source of truth               │
// │                                                       │
// │  Change values here → updates everywhere.             │
// │  CSS variables are set in globals.css via @theme.     │
// │  This file exports JS-side tokens for components      │
// │  that need programmatic access.                       │
// └─────────────────────────────────────────────────────┘

export const theme = {
  // ─── Colors ───
  colors: {
    primary: "#f59e0b",        // amber-500
    primaryLight: "#fbbf24",   // amber-400
    primaryDark: "#d97706",    // amber-600
    primaryGlow: "rgba(245, 158, 11, 0.3)",

    background: "#ffffff",
    foreground: "#0a0a0a",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    border: "#e5e5e5",

    // Dark surfaces (hero, map section, badges)
    darkBg: "#0c0c1d",
    darkSurface: "#1a1a2e",
    darkBorder: "rgba(245, 158, 11, 0.3)",

    // Alliance colors
    nda: "#4ade80",     // green-400
    india: "#60a5fa",   // blue-400

    // Semantic
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
  },

  // ─── Typography ───
  font: {
    family: "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif",
    sizes: {
      xs: "0.75rem",      // 12px
      sm: "0.875rem",     // 14px
      base: "1rem",       // 16px
      lg: "1.125rem",     // 18px
      xl: "1.25rem",      // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
      "5xl": "3rem",      // 48px
      "6xl": "3.75rem",   // 60px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // ─── Animation ───
  animation: {
    easing: {
      expOut: [0.16, 1, 0.3, 1],
      quartOut: [0.25, 1, 0.5, 1],
      circInOut: [0.85, 0, 0.15, 1],
    },
    duration: {
      fast: 0.2,
      normal: 0.4,
      slow: 0.7,
      slower: 1.2,
    },
  },

  // ─── Layout ───
  layout: {
    maxWidth: "1440px",
    headerHeight: {
      mobile: "3.5rem",   // 56px
      sm: "4rem",          // 64px
      md: "5rem",          // 80px
      lg: "6rem",          // 96px
    },
  },

  // ─── Radius ───
  radius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
} as const;
