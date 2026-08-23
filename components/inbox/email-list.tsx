import EmailRow from "@/components/inbox/email-row";
import type { Email } from "@/content/types";

export default function EmailList({ emails }: { emails: Email[] }) {
  return (
    <ul className="flex-1">
      {emails.map((email) => (
        <EmailRow key={email.id} email={email} />
      ))}
    </ul>
  );
}
