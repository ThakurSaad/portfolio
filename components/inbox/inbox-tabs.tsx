import Link from "next/link";
import { Inbox, Tag, Users } from "lucide-react";

// Gmail's inbox tabs live INSIDE the list pane, not in the sidebar.
// Per concept.md: Primary → projects, Promotions → testimonials/certs,
// Social → profile links.
const tabs = [
  { label: "Primary", href: "/", icon: Inbox, color: "text-[var(--gmail-accent)]" },
  { label: "Promotions", href: "#", icon: Tag, color: "text-[#188038] dark:text-[#81c995]" },
  { label: "Social", href: "#", icon: Users, color: "text-[#1a73e8] dark:text-[#8ab4f8]" },
];

export default function InboxTabs() {
  return (
    <nav
      aria-label="Inbox categories"
      className="flex border-b border-[var(--gmail-divider)] px-2"
    >
      {tabs.map(({ label, href, icon: Icon, color }) => {
        const isActive = href === "/";
        const className = [
          "flex items-center gap-3 h-14 px-4 md:px-6 text-sm max-w-[240px] flex-1 md:flex-none",
          "border-b-[3px] -mb-px transition-colors",
          isActive
            ? "border-[var(--gmail-accent)] text-[var(--gmail-accent)] font-medium"
            : "border-transparent text-muted-foreground hover:bg-[var(--gmail-sidebar-hover)]",
        ].join(" ");

        const inner = (
          <>
            <Icon size={20} className={`shrink-0 ${isActive ? "" : color}`} />
            <span className="truncate">{label}</span>
          </>
        );

        return href === "#" ? (
          <a key={label} href="#" className={className}>
            {inner}
          </a>
        ) : (
          <Link key={label} href={href} className={className} aria-current="page">
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
