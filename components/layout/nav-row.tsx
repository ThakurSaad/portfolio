// components/layout/nav-row.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavRow({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex items-center h-8 pl-[26px] pr-3 rounded-r-full text-sm transition-colors",
        active
          ? "bg-[var(--gmail-sidebar-active)] text-[var(--gmail-sidebar-active-fg)] font-medium"
          : "text-foreground hover:bg-[var(--gmail-sidebar-hover)]",
      ].join(" ")}
    >
      {children}
      <span className="flex-1 truncate ml-[18px]">{label}</span>
      {count != null && count > 0 && (
        <span className="ml-auto text-xs font-medium tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
