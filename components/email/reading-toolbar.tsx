import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  AlertOctagon,
  Trash2,
  MailOpen,
  Clock,
  FolderInput,
  Tag,
  MoreVertical,
  Printer,
} from "lucide-react";

const iconBtn =
  "w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)] text-muted-foreground";

// Grouped exactly like Gmail's reading-view toolbar.
const actions = [
  { icon: Archive, label: "Archive" },
  { icon: AlertOctagon, label: "Report spam" },
  { icon: Trash2, label: "Delete" },
  { icon: MailOpen, label: "Mark as unread" },
  { icon: Clock, label: "Snooze" },
  { icon: FolderInput, label: "Move to" },
  { icon: Tag, label: "Labels" },
];

export default function ReadingToolbar() {
  return (
    <div className="flex items-center h-12 px-2 gap-1 sticky top-0 bg-[var(--gmail-card)] z-10">
      <Link href="/" aria-label="Back to Inbox" className={iconBtn}>
        <ArrowLeft size={18} />
      </Link>

      <span className="w-px h-6 bg-[var(--gmail-divider)] mx-1" />

      {actions.map(({ icon: Icon, label }) => (
        <button
          key={label}
          aria-label={label}
          className={`${iconBtn} hidden sm:flex`}
        >
          <Icon size={18} />
        </button>
      ))}
      <button aria-label="More" className={iconBtn}>
        <MoreVertical size={18} />
      </button>

      {/* Print is how the resume download is triggered (see concept.md) */}
      <button aria-label="Print" className={`${iconBtn} ml-auto`}>
        <Printer size={18} />
      </button>
    </div>
  );
}
