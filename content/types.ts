export type Block =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; icon?: string; text: string }
  | { type: "attachment"; filename: string; href: string; size: string };

export type Label = "typescript" | "react" | "node" | "mongodb" | "express";

export type Email = {
  id: string;
  sender: string; // company or context
  subject: string; // project title
  snippet: string; // one-line preview
  date: string; // display date like "Jul 15"
  labels: Label[];
  starred: boolean;
  read: boolean;
  body: Block[]; // the case study content
};
