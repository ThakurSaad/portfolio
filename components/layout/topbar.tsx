import { Search, HelpCircle, Settings } from "lucide-react";
import ThemeToggle from "../theme-toggle";

export default function Topbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-2 px-2 border-b border-border">
      {/* Left zone */}
      <div className="flex items-center gap-1 w-[256px] shrink-0">
        {/* hamburger — client island in step 4 */}
        <div className="w-10 h-10" />
        <span className="text-xl font-medium text-[#1a73e8] ml-1">
          Gmail
        </span>
      </div>

      {/* Search */}
      <form method="get" action="/" className="flex-1 max-w-[720px]">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="flex items-center gap-3 bg-[#eaf1fb] dark:bg-[#2d2d2d] rounded-full px-4 h-12 hover:bg-[#dde3ea] dark:hover:bg-[#3c4043] transition-colors focus-within:bg-white dark:focus-within:bg-[#3c4043] focus-within:shadow-md">
          <Search size={20} className="text-muted-foreground shrink-0" />
          <input
            id="search"
            name="q"
            type="search"
            placeholder="Search portfolio"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </form>

      {/* Right zone */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          aria-label="Help"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
        >
          <HelpCircle size={20} className="text-muted-foreground" />
        </button>
        <button
          aria-label="Settings"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
        >
          <Settings size={20} className="text-muted-foreground" />
        </button>
        <ThemeToggle />
        <div className="w-10 h-10" />
        {/* avatar */}
        <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-medium ml-1">
          T
        </div>
      </div>
    </header>
  );
}
