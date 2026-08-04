export type Block =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; icon?: string; text: string }
  | { type: "attachment"; filename: string; href: string; size: string };

export type Label =
  | "aws"
  | "docker"
  | "express"
  | "graphql"
  | "javascript"
  | "jwt"
  | "mongodb"
  | "nextjs"
  | "node"
  | "postgresql"
  | "react"
  | "redis"
  | "socket.io"
  | "tailwind"
  | "typescript";

/**
 * ISO calendar date, e.g. "2026-07-20".
 *
 * A template literal type, not just `string` — so a display value like
 * "Jul 15" is a compile error. ISO also sorts correctly as plain text,
 * which is what lets the inbox sort without parsing anything.
 */
export type IsoDate = `${number}-${number}-${number}`;

export type Email = {
  id: string;
  sender: string; // company or context
  subject: string; // project title
  snippet: string; // one-line preview
  date: IsoDate; // ISO — formatted for display at render time
  labels: Label[];
  starred: boolean;
  read: boolean;
  body: Block[]; // the case study content
};
