"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResolvedTheme } from "@/lib/themes";

const ThemeContext = createContext<ResolvedTheme | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

interface ThemeProviderProps {
  theme: ResolvedTheme;
  children: ReactNode;
}

export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <div
        data-theme={theme.style}
        data-mode={theme.mode}
        className="gradient-bg min-h-screen"
        style={theme.cssVars as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
