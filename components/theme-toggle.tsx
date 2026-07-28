"use client";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
    >
      {/* Both icons render on the server; the active theme decides which is
          visible, so there is nothing for hydration to disagree about. */}
      <Moon size={20} className="text-muted-foreground dark:hidden" />
      <Sun size={20} className="text-muted-foreground hidden dark:block" />
    </button>
  );
}
