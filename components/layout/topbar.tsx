import { Search, HelpCircle, Settings, SlidersHorizontal, Menu, Grid3x3 } from "lucide-react";
import ThemeToggle from "../theme-toggle";

export default function Topbar({ hamburger }: { hamburger?: React.ReactNode }) {
  return (
    <header className="h-16 shrink-0 flex items-center gap-2 px-2 md:px-4">
      {/* Left zone — hamburger + wordmark, sits above the sidebar */}
      <div className="flex items-center gap-1 shrink-0 md:w-[240px]">
        <div className="md:hidden">{hamburger}</div>
        {/* Desktop hamburger: Gmail shows this at all sizes */}
        <button
          aria-label="Main menu"
          className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)] text-muted-foreground"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:inline font-medium text-[var(--gmail-accent)] ml-1 tracking-tight">
          Gmail
        </span>
      </div>

      {/* Search — a plain GET form, so filtering needs zero client JS */}
      <form method="get" action="/" className="flex-1 min-w-0 max-w-[720px]">
        <label htmlFor="search" className="sr-only">
          Search portfolio
        </label>
        <div className="flex items-center gap-3 bg-[#eaf1fb] dark:bg-[#2d2d2d] rounded-lg focus-within:rounded-t-lg focus-within:rounded-b-lg px-3 h-12 hover:bg-[#dde3ea] dark:hover:bg-[#3c4043] transition-colors focus-within:bg-[var(--gmail-card)] focus-within:shadow-[var(--gmail-shadow-hover)]">
          <button
            type="submit"
            aria-label="Search"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
          >
            <Search size={20} className="text-muted-foreground" />
          </button>
          <input
            id="search"
            name="q"
            type="search"
            placeholder="Search portfolio"
            className="flex-1 min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="button"
            aria-label="Show search options"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
          >
            <SlidersHorizontal size={20} className="text-muted-foreground" />
          </button>
        </div>
      </form>

      {/* Right zone */}
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <button
          aria-label="Support"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
        >
          <HelpCircle size={20} className="text-muted-foreground" />
        </button>
        <button
          aria-label="Settings"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
        >
          <Settings size={20} className="text-muted-foreground" />
        </button>
        <ThemeToggle />
        <button
          aria-label="Google apps"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
        >
          <Grid3x3 size={20} className="text-muted-foreground" />
        </button>
        <div
          aria-label="Account"
          className="w-8 h-8 rounded-full bg-[var(--gmail-accent)] flex items-center justify-center text-white dark:text-[#001d35] text-sm font-medium ml-1 shrink-0"
        >
          T
        </div>
      </div>
    </header>
  );
}
