import { emails } from "@/content/email";
import { Star } from "lucide-react";
import Link from "next/link";

export default function InboxPage() {
  return (
    <div>
      {emails.map((email) => (
        <Link
          key={email.id}
          href={`/email/${email.id}`}
          className={`${
            email.read ? "font-normal" : "font-bold"
          } flex items-center gap-4 px-4 py-2 border-b border-border hover:bg-[var(--gmail-sidebar-hover)] hover:shadow-sm`}
        >
          <Star
            size={16}
            className={
              email.starred
                ? "fill-[#f4b400] text-[#f4b400]"
                : "text-muted-foreground"
            }
          />
          <span className=" w-[200px] truncate shrink-0">{email.sender}</span>
          <span className="flex-1 min-w-0 truncate">{email.subject}</span>
          <span className="flex-1 min-w-0 truncate"> — {email.snippet}</span>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            {email.date}
          </span>
        </Link>
      ))}
    </div>
  );
}
