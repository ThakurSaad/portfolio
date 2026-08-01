import InboxTabs from "@/components/inbox/inbox-tabs";
import ListToolbar from "@/components/inbox/list-toolbar";
import EmailRow from "@/components/inbox/email-row";
import { sortedEmails } from "@/lib/emails";

export default function InboxPage() {
  return (
    <div className="flex flex-col min-h-full">
      <h1 className="sr-only">Inbox</h1>
      <ListToolbar total={sortedEmails.length} />
      <InboxTabs />
      <ul className="flex-1">
        {sortedEmails.map((email) => (
          <EmailRow key={email.id} email={email} />
        ))}
      </ul>
    </div>
  );
}
