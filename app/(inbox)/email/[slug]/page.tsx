import { notFound } from "next/navigation";
import { emails } from "@/content/email";
import { BlockContent } from "@/components/email/block-renderer";
import { Signature } from "@/components/email/signature";
import ReadingToolbar from "@/components/email/reading-toolbar";
import { formatEmailDate } from "@/lib/emails";
import { Star, Reply, MoreVertical, Forward } from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return emails.map((email) => ({ slug: email.id }));
}

export default async function EmailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const email = emails.find((e) => e.id === slug);
  if (!email) notFound();

  return (
    <>
      <ReadingToolbar />

      <article className="px-4 md:px-16 pb-10 max-w-[1000px]">
        <header className="flex items-start gap-4 mb-6">
          <h1 className="text-[22px] font-normal leading-8 flex-1 min-w-0">
            {email.subject}
          </h1>
          <span className="flex items-center gap-2 shrink-0 pt-1">
            {email.labels.map((label) => (
              <span
                key={label}
                className="hidden md:inline text-xs px-2 py-0.5 rounded bg-[var(--gmail-sidebar-hover)] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </span>
        </header>

        {/* Sender row — avatar, name, date, and reply affordances */}
        <div className="flex items-start gap-4 mb-6">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-[var(--gmail-accent)] text-white dark:text-[#001d35] flex items-center justify-center text-base font-medium shrink-0"
          >
            {email.sender.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{email.sender}</span>
              <span className="text-xs text-muted-foreground truncate">
                &lt;portfolio@thakursaad.dev&gt;
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">to me</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <time
              dateTime={email.date}
              className="text-xs text-muted-foreground mr-1"
            >
              {formatEmailDate(email.date)}
            </time>
            <button
              aria-label={email.starred ? "Starred" : "Star"}
              aria-pressed={email.starred}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
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
            <button
              aria-label="Reply"
              className="w-9 h-9 hidden sm:flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
            >
              <Reply size={18} className="text-muted-foreground" />
            </button>
            <button
              aria-label="More"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--gmail-sidebar-hover)]"
            >
              <MoreVertical size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="text-sm leading-relaxed md:pl-14">
          {email.body.map((block, i) => (
            <BlockContent key={i} block={block} />
          ))}
          <Signature />

          {/* Gmail's reply / forward buttons close every thread */}
          <div className="flex gap-3 mt-8">
            <button className="flex items-center gap-2 h-9 px-5 rounded-full border border-border text-sm hover:bg-[var(--gmail-sidebar-hover)] hover:shadow-sm transition">
              <Reply size={16} />
              Reply
            </button>
            <button className="flex items-center gap-2 h-9 px-5 rounded-full border border-border text-sm hover:bg-[var(--gmail-sidebar-hover)] hover:shadow-sm transition">
              <Forward size={16} />
              Forward
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
