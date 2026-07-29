// components/layout/mobile-sidebar-toggle.tsx
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileSidebarToggle({
  children, // ← the sidebar content, rendered by the server
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — lives in the topbar */}
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)] md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay + sidebar drawer — only visible when open */}

      <div
        className={`fixed inset-0 z-50 md:hidden transition-colors duration-300
          ${open ? "bg-[rgba(0,0,0,0.5)]" : "bg-transparent pointer-events-none"}`}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`absolute left-0 top-0 h-full w-[256px] bg-background transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)] m-1"
          >
            <X size={20} />
          </button>
          {children}
        </aside>
      </div>
    </>
  );
}
