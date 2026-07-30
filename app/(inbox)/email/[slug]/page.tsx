import { notFound } from "next/navigation";
import { emails } from "@/content/email";

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

  return <div className="p-6 max-w-3xl">{email.subject}</div>; // real reading view is step 3
}
