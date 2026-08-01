import { notFound } from "next/navigation";
import { emails } from "@/content/email";
import { BlockContent } from "@/components/email/block-renderer";
import { Star } from "lucide-react";

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
    <article className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-normal mb-4">{email.subject}</h1>

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        {email.starred && (
          <Star size={18} className="fill-[#f4b400] text-[#f4b400]" />
        )}
        <span className="font-medium">{email.sender}</span>
        <span className="ml-auto text-sm text-muted-foreground">
          {email.date}
        </span>
      </div>

      {email.body.map((block, i) => (
        <BlockContent key={i} block={block} />
      ))}
    </article>
  );
}
