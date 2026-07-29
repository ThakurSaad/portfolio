import MobileSidebarToggle from "@/components/layout/mobile-sidebar-toggle";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          hamburger={
            <MobileSidebarToggle>
              <Sidebar />
            </MobileSidebarToggle>
          }
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
