import Link from "next/link";
import {
  PencilLine,
  Inbox,
  Star,
  AlertCircle,
  Send,
  FileText,
  Tag,
} from "lucide-react";

const navItems = [
  { label: "Inbox", href: "/", icon: Inbox },
  { label: "Starred", href: "#", icon: Star },
  { label: "Important", href: "/important", icon: AlertCircle },
  { label: "Sent", href: "#", icon: Send },
  { label: "Drafts", href: "#", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="w-[256px] shrink-0 h-full flex flex-col py-2">
      {/* Compose */}
      <div className="px-2 mb-2">
        <button className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[var(--gmail-compose-bg)] hover:shadow-md transition-shadow">
          <PencilLine size={20} />
          <span className="text-sm font-medium text-[#001d35] dark:text-[var(--gmail-blue-dark)]">Compose</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        {navItems.map(({ label, href, icon: Icon }) =>
          href === "#" ? (
            <a
              key={label}
              href="#"
              className="flex items-center gap-4 px-4 py-1 h-8 rounded-r-full hover:bg-[var(--gmail-sidebar-hover)] text-sm text-foreground"
            >
              <Icon size={18} />
              {label}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-4 px-4 py-1 h-8 rounded-r-full hover:bg-[var(--gmail-sidebar-hover)] text-sm text-foreground"
            >
              <Icon size={18} />
              {label}
            </Link>
          ),
        )}
      </nav>

      {/* Labels section */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          <Tag size={14} />
          Labels
        </div>
        {/* M4 fills this in */}
      </div>
    </aside>
  );
}
