"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user already has a preference stored
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    setIsLight(!isLight);
    if (!isLight) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  if (!mounted) {
    return <div className="w-8 h-8" />; // Placeholder to avoid hydration mismatch
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      aria-label="Toggle theme"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
