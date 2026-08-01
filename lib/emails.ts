import { emails } from "@/content/email";
import type { Email } from "@/content/types";

/**
 * Gmail is strictly reverse-chronological. ISO dates sort correctly as
 * plain strings, so no Date parsing is needed. Runs once at build time.
 */
export const sortedEmails: Email[] = [...emails].sort((a, b) =>
  b.date.localeCompare(a.date),
);

/**
 * Gmail's date column: "Jul 20" within the current year, "Jul 20, 2025"
 * for anything older. Formatted with a fixed locale so the build output
 * is identical on every machine (and can't drift between server and client).
 */
export function formatEmailDate(iso: string, now: Date = new Date()): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;

  const sameYear = date.getUTCFullYear() === now.getUTCFullYear();

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone: "UTC",
  }).format(date);
}
