export type Block =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; icon?: string; text: string }
  | { type: "attachment"; filename: string; href: string; size: string };

export type Label =
  | "accessibility"
  | "angular"
  | "apollo"
  | "auth"
  | "aws"
  | "bash"
  | "beautifulsoup"
  | "c#"
  | "chrome-api"
  | "cli"
  | "cron"
  | "css"
  | "d3"
  | "dart"
  | "django"
  | "docker"
  | "electron"
  | "elixir"
  | "ethereum"
  | "expo"
  | "express"
  | "fastapi"
  | "firebase"
  | "flutter"
  | "gamedev"
  | "gatsby"
  | "go"
  | "graphql"
  | "hardhat"
  | "helm"
  | "html"
  | "java"
  | "javascript"
  | "jwt"
  | "keras"
  | "kubernetes"
  | "lambda"
  | "laravel"
  | "linux"
  | "markdown"
  | "mongodb"
  | "mysql"
  | "nestjs"
  | "nextjs"
  | "node"
  | "php"
  | "phoenix"
  | "postgresql"
  | "python"
  | "rails"
  | "react"
  | "react-native"
  | "redis"
  | "redux"
  | "regex"
  | "ruby"
  | "rust"
  | "rxjs"
  | "socket.io"
  | "solidity"
  | "spring"
  | "sqlite"
  | "stripe"
  | "svelte"
  | "svg"
  | "tailwind"
  | "tensorflow"
  | "typescript"
  | "unity"
  | "vercel"
  | "vite"
  | "vue"
  | "websockets"
  | "yaml";

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
