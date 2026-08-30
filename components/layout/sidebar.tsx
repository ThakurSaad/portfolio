import {
  PencilLine,
  Inbox,
  Star,
  AlertCircle,
  Send,
  FileText,
  ChevronDown,
  Tag,
} from "lucide-react";
import { emails } from "@/content/email";
import NavRow from "./nav-row";
import { LABEL_SLUGS, labelsInUse } from "@/lib/labels";

const navItems = [
  { label: "Inbox", href: "/", icon: Inbox },
  { label: "Starred", href: "#", icon: Star },
  { label: "Important", href: "#", icon: AlertCircle },
  { label: "Sent", href: "#", icon: Send },
  { label: "Drafts", href: "#", icon: FileText },
];

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

      <nav aria-label="Main" className="mt-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const count =
            label === "Inbox"
              ? unreadCount
              : label === "Starred"
                ? starredCount
                : undefined;

          return (
            <NavRow key={label} href={href} label={label} count={count}>
              <Icon size={20} className="shrink-0" />
            </NavRow>
          );
        })}

        <button className="group flex items-center h-8 pl-[26px] pr-3 rounded-r-full text-sm transition-colors w-full text-foreground hover:bg-[var(--gmail-sidebar-hover)]">
          <ChevronDown size={20} className="shrink-0" />
          <span className="ml-[18px]">More</span>
        </button>
      </nav>

      <div className="mt-4">
        <div className="flex items-center h-8 pl-[26px] pr-3 text-sm text-muted-foreground">
          <span>Labels</span>
        </div>
        {labelsInUse().map((l) => (
          <NavRow key={l} href={`/label/${LABEL_SLUGS[l]}`} label={l}>
            <Tag size={20} className="shrink-0" />
          </NavRow>
        ))}
      </div>
    </aside>
  );
}
