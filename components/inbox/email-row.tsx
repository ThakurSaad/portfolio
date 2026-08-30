import Link from "next/link";
import { Star } from "lucide-react";
import type { Email } from "@/content/types";
import { formatEmailDate } from "@/lib/emails";

export default function EmailRow({ email }: { email: Email }) {
  const unread = !email.read;

  const star = (
    <button
      aria-label={email.starred ? `Starred: ${email.subject}` : `Star ${email.subject}`}
      aria-pressed={email.starred}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
    >
      <Star
        size={18}
        className={
          email.starred
            ? "fill-[var(--gmail-star)] text-[var(--gmail-star)]"
            : "text-muted-foreground"
        }
      />
    </button>
  );

  return (
    <li
      className={[
        "group relative",
        "border-b border-[var(--gmail-divider)]",
        // Gmail: unread rows are white and heavier; read rows recede.
        unread
          ? "bg-[var(--gmail-row-unread)]"
          : "bg-[var(--gmail-row-read)]",
        // Hover lifts the row rather than tinting it.
        "hover:shadow-[var(--gmail-shadow-hover)] hover:z-10",
      ].join(" ")}
    >
      {/* Mobile: avatar-led and stacked. One line has no room for sender,
          subject and snippet at phone widths, so each gets its own row. */}
      <div className="flex md:hidden items-center gap-1 px-2">
        <Link
          href={`/email/${email.id}`}
          className="flex items-start gap-3 flex-1 min-w-0 py-3 focus-visible:outline-2 focus-visible:outline-[var(--gmail-accent)] rounded"
        >
          <span
            aria-hidden
            className="w-10 h-10 rounded-full bg-[var(--gmail-accent)] text-white flex items-center justify-center text-base font-medium shrink-0"
          >
            {email.sender.charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 min-w-0">
            <span className="flex items-baseline gap-2">
              <span
                className={`flex-1 min-w-0 truncate text-sm ${
                  unread ? "font-medium text-foreground" : "text-foreground"
                }`}
              >
                {email.sender}
              </span>
              <time
                dateTime={email.date}
                className={`shrink-0 text-xs tabular-nums ${
                  unread
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {formatEmailDate(email.date)}
              </time>
            </span>
            <span
              className={`block truncate text-sm ${
                unread ? "font-medium text-foreground" : "text-foreground"
              }`}
            >
              {email.subject}
            </span>
            <span className="block truncate text-sm text-muted-foreground">
              {email.snippet}
            </span>
          </span>
        </Link>
        {star}
      </div>

      {/* Desktop: the single-line Gmail row. */}
      <div className="hidden md:flex items-center h-10 pl-2 pr-4 gap-1">
        <label className="flex items-center px-2 shrink-0 cursor-pointer">
          <span className="sr-only">Select {email.subject}</span>
          <input
            type="checkbox"
            className="w-[18px] h-[18px] accent-[var(--gmail-accent)] cursor-pointer"
          />
        </label>

        {star}

        <Link
          href={`/email/${email.id}`}
          className="flex items-center gap-4 flex-1 min-w-0 h-full px-2 focus-visible:outline-2 focus-visible:outline-[var(--gmail-accent)] rounded"
        >
          <span
            className={`w-[180px] shrink-0 truncate text-sm ${
              unread ? "font-medium text-foreground" : "text-foreground"
            }`}
          >
            {email.sender}
          </span>

          {/* Subject and snippet share ONE truncating region, exactly like
              Gmail — the subject keeps its natural width and the snippet
              absorbs the remainder. */}
          <span className="flex-1 min-w-0 truncate text-sm">
            <span className={unread ? "font-medium text-foreground" : "text-foreground"}>
              {email.subject}
            </span>
            <span className="text-muted-foreground"> - {email.snippet}</span>
          </span>

          <time
            dateTime={email.date}
            className={`shrink-0 text-xs tabular-nums ${
              unread ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            {formatEmailDate(email.date)}
          </time>
        </Link>
      </div>
    </li>
  );
}
