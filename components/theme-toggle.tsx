"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-8" disabled>
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <svg
        className="size-4 transition-all duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Sun rays — visible in dark mode, rotate out in light */}
        <g
          className={`origin-center transition-all duration-500 ${
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
        {/* Sun circle / Moon — morphs between the two */}
        <circle
          cx="12"
          cy="12"
          r="5"
          className={`transition-all duration-500 ${
            isDark ? "scale-100" : "scale-100"
          }`}
          fill={isDark ? "none" : "currentColor"}
          stroke="currentColor"
        />
        {/* Moon cutout overlay — slides in for dark mode */}
        <circle
          cx="16"
          cy="8"
          r="4"
          className={`transition-all duration-500 ${
            isDark
              ? "opacity-100 translate-x-0 translate-y-0"
              : "opacity-0 translate-x-2 -translate-y-2"
          }`}
          fill="var(--color-background)"
          stroke="none"
        />
      </svg>
    </Button>
  );
}
