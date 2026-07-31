import Image from "next/image";
import type { Block } from "@/content/types";

export function BlockContent({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p className="my-4 leading-7">{block.text}</p>;

    case "image":
      return (
        <Image
          src={block.src}
          alt={block.alt}
          width={block.width}
          height={block.height}
          className="my-4 rounded-lg h-auto"
        />
      );

    case "code":
      return (
        <pre className="my-4 p-4 rounded-lg bg-muted overflow-x-auto text-sm">
          <code>{block.code}</code>
        </pre>
      );

    case "quote":
      return (
        <blockquote className="my-4 pl-4 border-l-4 border-border italic">
          {block.text}
          {block.attribution && (
            <footer className="mt-1 text-sm text-muted-foreground">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );

    case "callout":
      return (
        <div className="my-4 p-4 rounded-lg bg-muted flex gap-2">
          {block.icon && <span>{block.icon}</span>}
          <span>{block.text}</span>
        </div>
      );

    case "attachment":
      return (
        <a
          href={block.href}
          className="my-4 flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted"
        >
          <span className="truncate">{block.filename}</span>
          <span className="ml-auto text-sm text-muted-foreground">
            {block.size}
          </span>
        </a>
      );

    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
