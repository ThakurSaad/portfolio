import type { Label } from "@/content/types";
import type { Email } from "@/content/types";
import { sortedEmails } from "@/lib/emails";

// 1. For each label, the text that goes in the URL.
//    (a "slug" = the URL-safe version of a word)
export const LABEL_SLUGS: Record<Label, string> = {
  typescript: "typescript",
  javascript: "javascript",
  node: "node",
  express: "express",
  mongodb: "mongodb",
  react: "react",
  nextjs: "nextjs",
  tailwind: "tailwind",
  docker: "docker",
  postgresql: "postgresql",
  redis: "redis",
  jwt: "jwt",
  graphql: "graphql",
  aws: "aws",
  "socket.io": "socket-io",
};

// 2. The same thing, flipped: URL text -> label. Built once, right here.
const SLUG_TO_LABEL = Object.fromEntries(
  Object.entries(LABEL_SLUGS).map(([label, slug]) => [slug, label]),
) as Record<string, Label>;

// 3. Given a slug from the URL, get the label back (or nothing if bogus).
export function slugToLabel(slug: string): Label | undefined {
  return SLUG_TO_LABEL[slug];
}

// 4. Every label that at least one email actually uses.
export function labelsInUse(): Label[] {
  return [...new Set(sortedEmails.flatMap((e) => e.labels))];
}

// 5. All emails that carry a given label.
export function emailsByLabel(label: Label): Email[] {
  return sortedEmails.filter((e) => e.labels.includes(label));
}
