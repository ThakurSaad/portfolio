import Link from "next/link";
import {
  PencilLine,
  Inbox,
  Star,
  AlertCircle,
  Send,
  FileText,
  ChevronDown,
} from "lucide-react";
import { emails } from "@/content/email";

const navItems = [
  { label: "Inbox", href: "/", icon: Inbox },
  { label: "Starred", href: "#", icon: Star },
  { label: "Important", href: "/important", icon: AlertCircle },
  { label: "Sent", href: "#", icon: Send },
  { label: "Drafts", href: "#", icon: FileText },
];

// Gmail's nav rows: 32px tall, pill-rounded on the trailing edge only.
const rowBase =
  "group flex items-center h-8 pl-[26px] pr-3 rounded-r-full text-sm transition-colors";

export default function Sidebar() {
  const unreadCount = emails.filter((e) => !e.read).length;
  const starredCount = emails.filter((e) => e.starred).length;

  return (
    <aside className="w-[256px] shrink-0 h-full flex flex-col overflow-y-auto pb-4">
      {/* Compose — 56px pill, Gmail's signature control */}
      <div className="px-2 py-2">
        <button className="flex items-center gap-3 h-14 pl-4 pr-6 rounded-2xl bg-[var(--gmail-compose-bg)] text-[var(--gmail-compose-fg)] hover:shadow-[var(--gmail-shadow-hover)] transition-shadow">
          <PencilLine size={20} />
          <span className="text-sm font-medium">Compose</span>
        </button>
      </div>

      <nav className="mt-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          // Every route in this layout is inbox context today, so Inbox is the
          // active row. Revisit when /label/[slug] lands in M4.
          const isActive = href === "/";
          const count =
            label === "Inbox"
              ? unreadCount
              : label === "Starred"
                ? starredCount
                : 0;

          const className = [
            rowBase,
            isActive
              ? "bg-[var(--gmail-sidebar-active)] text-[var(--gmail-sidebar-active-fg)] font-medium"
              : "text-foreground hover:bg-[var(--gmail-sidebar-hover)]",
          ].join(" ");

          const inner = (
            <>
              <Icon
                size={20}
                className="shrink-0"
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="ml-[18px] truncate">{label}</span>
              {count > 0 && (
                <span className="ml-auto text-xs font-medium tabular-nums">
                  {count}
                </span>
              )}
            </>
          );

          return href === "#" ? (
            <a key={label} href="#" className={className}>
              {inner}
            </a>
          ) : (
            <Link key={label} href={href} className={className}>
              {inner}
            </Link>
          );
        })}

        <button className={`${rowBase} w-full text-foreground hover:bg-[var(--gmail-sidebar-hover)]`}>
          <ChevronDown size={20} className="shrink-0" />
          <span className="ml-[18px]">More</span>
        </button>
      </nav>

      {/* Labels — populated in M4 */}
      <div className="mt-4">
        <div className="flex items-center justify-between h-8 pl-[26px] pr-3 text-sm text-muted-foreground">
          <span>Labels</span>
        </div>
      </div>
    </aside>
  );
}
