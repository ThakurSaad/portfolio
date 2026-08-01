import {
  ChevronDown,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const iconBtn =
  "w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)] text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent";

export default function ListToolbar({ total }: { total: number }) {
  return (
    <div className="flex items-center h-12 px-2 gap-1 shrink-0">
      <div className="flex items-center">
        <label className="flex items-center pl-3 pr-1 cursor-pointer">
          <span className="sr-only">Select all conversations</span>
          <input
            type="checkbox"
            className="w-[18px] h-[18px] accent-[var(--gmail-accent)] cursor-pointer"
          />
        </label>
        <button aria-label="Selection options" className="w-6 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)] text-muted-foreground">
          <ChevronDown size={16} />
        </button>
      </div>

      <button aria-label="Refresh" className={iconBtn}>
        <RefreshCw size={18} />
      </button>
      <button aria-label="More options" className={iconBtn}>
        <MoreVertical size={18} />
      </button>

      <div className="ml-auto flex items-center gap-1">
        <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
          1&ndash;{total} of {total}
        </span>
        <button aria-label="Newer" className={iconBtn} disabled>
          <ChevronLeft size={18} />
        </button>
        <button aria-label="Older" className={iconBtn} disabled>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
