import EmailList from "@/components/inbox/email-list";
import InboxTabs from "@/components/inbox/inbox-tabs";
import ListToolbar from "@/components/inbox/list-toolbar";
import { sortedEmails } from "@/lib/emails";

export default function InboxPage() {
  return (
    <div className="flex flex-col min-h-full">
      <h1 className="sr-only">Inbox</h1>
      <ListToolbar total={sortedEmails.length} />
      <InboxTabs />
      <EmailList emails={sortedEmails} />
    </div>
  );
}
