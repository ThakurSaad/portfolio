import { LABEL_SLUGS, slugToLabel, emailsByLabel } from "@/lib/labels";
import ListToolbar from "@/components/inbox/list-toolbar";
import EmailList from "@/components/inbox/email-list";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.values(LABEL_SLUGS).map((label) => ({ label }));
}

export const dynamicParams = false;

export default async function LabelPage({
  params,
}: {
  params: Promise<{ label: string }>;
}) {
  const { label: slug } = await params;
  const label = slugToLabel(slug);
  if (!label) notFound();
  const emails = emailsByLabel(label);

  return (
    <div className="flex flex-col min-h-full">
      <h1 className="sr-only">{label} emails</h1>
      <ListToolbar total={emails.length} />
      <EmailList emails={emails} />
    </div>
  );
}
