"use client";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "dark",
  );

  function toggle() {
    const next = !dark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
    >
      {dark ? (
        <Sun size={20} className="text-muted-foreground" />
      ) : (
        <Moon size={20} className="text-muted-foreground" />
      )}
    </button>
  );
}
