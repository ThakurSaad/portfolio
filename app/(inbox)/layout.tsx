import MobileSidebarToggle from "@/components/layout/mobile-sidebar-toggle";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Gmail's real shape: the top bar spans the FULL width, and the sidebar
    // starts below it — not beside it.
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Topbar
        hamburger={
          <MobileSidebarToggle>
            <Sidebar />
          </MobileSidebarToggle>
        }
      />

      <div className="flex flex-1 min-h-0">
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* The list / reading view floats as a white rounded card on the
            app background — the post-2022 Gmail look. */}
        <main className="flex-1 min-w-0 pr-2 pb-2 md:pl-0 pl-2">
          <div className="h-full overflow-y-auto rounded-2xl bg-[var(--gmail-card)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
