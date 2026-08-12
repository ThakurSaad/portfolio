import { LABEL_SLUGS, slugToLabel, emailsByLabel } from "@/lib/labels";
import ListToolbar from "@/components/inbox/list-toolbar";
import EmailRow from "@/components/inbox/email-row";

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
  const label = slugToLabel(slug)!;
  const emails = emailsByLabel(label);

  return (
    <div className="flex flex-col min-h-full">
      <h1 className="sr-only">{label} emails</h1>
      <ListToolbar total={emails.length} />
      <ul className="flex-1">
        {emails.map((email) => (
          <EmailRow key={email.id} email={email} />
        ))}
      </ul>
    </div>
  );
}
