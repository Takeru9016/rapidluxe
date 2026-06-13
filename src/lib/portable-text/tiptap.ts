// Bidirectional conversion between Tiptap's document JSON and Sanity Portable
// Text. There is no official drop-in for this, so we cover the subset the admin
// editor produces: paragraphs, h2/h3 headings, blockquotes, bullet/number
// lists, the strong/em/code/strike decorators, links, and inline images.

import type { PortableTextBlock } from "@portabletext/react";

// ── Loose Tiptap JSON shapes ──────────────────────────────────────────────────

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

export interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
}

// ── Portable Text shapes (storage form) ───────────────────────────────────────

interface PTSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface PTMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface PTTextBlock {
  _type: "block";
  _key: string;
  style: string;
  markDefs: PTMarkDef[];
  children: PTSpan[];
  listItem?: "bullet" | "number";
  level?: number;
}

interface PTImageBlock {
  _type: "image";
  _key: string;
  url: string;
  alt?: string;
}

type PTBlock = PTTextBlock | PTImageBlock;

// ── Helpers ───────────────────────────────────────────────────────────────────

const key = () => Math.random().toString(36).slice(2, 12);

const DECORATOR_FROM_TIPTAP: Record<string, string> = {
  bold: "strong",
  italic: "em",
  code: "code",
  strike: "strike-through",
  underline: "underline",
};

const DECORATOR_TO_TIPTAP: Record<string, string> = {
  strong: "bold",
  em: "italic",
  code: "code",
  "strike-through": "strike",
  underline: "underline",
};

// ── Tiptap → Portable Text ────────────────────────────────────────────────────

function serializeInline(nodes: TiptapNode[] | undefined): {
  children: PTSpan[];
  markDefs: PTMarkDef[];
} {
  const children: PTSpan[] = [];
  const markDefs: PTMarkDef[] = [];

  for (const node of nodes ?? []) {
    if (node.type !== "text" || !node.text) continue;

    const marks: string[] = [];
    for (const mark of node.marks ?? []) {
      if (mark.type === "link") {
        const markKey = key();
        markDefs.push({
          _key: markKey,
          _type: "link",
          href: (mark.attrs?.href as string) ?? "#",
        });
        marks.push(markKey);
      } else {
        const decorator = DECORATOR_FROM_TIPTAP[mark.type];
        if (decorator) marks.push(decorator);
      }
    }

    children.push({ _type: "span", _key: key(), text: node.text, marks });
  }

  return { children, markDefs };
}

function textBlock(
  node: TiptapNode,
  style: string,
  extra?: Partial<PTTextBlock>,
): PTTextBlock {
  const { children, markDefs } = serializeInline(node.content);
  return { _type: "block", _key: key(), style, markDefs, children, ...extra };
}

export function tiptapToPortableText(doc: TiptapDoc): PortableTextBlock[] {
  const blocks: PTBlock[] = [];

  const pushList = (node: TiptapNode, listItem: "bullet" | "number") => {
    for (const item of node.content ?? []) {
      // listItem wraps one or more paragraphs
      for (const para of item.content ?? []) {
        if (para.type === "paragraph") {
          blocks.push(textBlock(para, "normal", { listItem, level: 1 }));
        }
      }
    }
  };

  for (const node of doc.content ?? []) {
    switch (node.type) {
      case "paragraph":
        blocks.push(textBlock(node, "normal"));
        break;
      case "heading": {
        const level = (node.attrs?.level as number) ?? 2;
        blocks.push(textBlock(node, level >= 3 ? "h3" : "h2"));
        break;
      }
      case "blockquote":
        for (const para of node.content ?? []) {
          if (para.type === "paragraph")
            blocks.push(textBlock(para, "blockquote"));
        }
        break;
      case "bulletList":
        pushList(node, "bullet");
        break;
      case "orderedList":
        pushList(node, "number");
        break;
      case "image":
        blocks.push({
          _type: "image",
          _key: key(),
          url: (node.attrs?.src as string) ?? "",
          alt: (node.attrs?.alt as string) ?? undefined,
        });
        break;
      default:
        break;
    }
  }

  return blocks as unknown as PortableTextBlock[];
}

// ── Portable Text → Tiptap ────────────────────────────────────────────────────

function deserializeSpans(block: PTTextBlock): TiptapNode[] {
  return (block.children ?? []).map((span) => {
    const marks: TiptapMark[] = [];
    for (const m of span.marks ?? []) {
      const def = block.markDefs?.find((d) => d._key === m);
      if (def?._type === "link") {
        marks.push({ type: "link", attrs: { href: def.href ?? "#" } });
      } else if (DECORATOR_TO_TIPTAP[m]) {
        marks.push({ type: DECORATOR_TO_TIPTAP[m] });
      }
    }
    return {
      type: "text",
      text: span.text,
      ...(marks.length ? { marks } : {}),
    };
  });
}

function paragraphFrom(block: PTTextBlock): TiptapNode {
  return { type: "paragraph", content: deserializeSpans(block) };
}

export function portableTextToTiptap(
  value: PortableTextBlock[] | null | undefined,
): TiptapDoc {
  const content: TiptapNode[] = [];
  const blocks = (value ?? []) as unknown as PTBlock[];

  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];

    if (block._type === "image") {
      content.push({
        type: "image",
        attrs: { src: block.url, alt: block.alt ?? null },
      });
      i += 1;
      continue;
    }

    // Group consecutive list items of the same kind into one list node.
    if (block.listItem) {
      const listItem = block.listItem;
      const items: TiptapNode[] = [];
      while (
        i < blocks.length &&
        blocks[i]._type === "block" &&
        (blocks[i] as PTTextBlock).listItem === listItem
      ) {
        items.push({
          type: "listItem",
          content: [paragraphFrom(blocks[i] as PTTextBlock)],
        });
        i += 1;
      }
      content.push({
        type: listItem === "bullet" ? "bulletList" : "orderedList",
        content: items,
      });
      continue;
    }

    if (block.style === "h2" || block.style === "h3") {
      content.push({
        type: "heading",
        attrs: { level: block.style === "h3" ? 3 : 2 },
        content: deserializeSpans(block),
      });
    } else if (block.style === "blockquote") {
      content.push({ type: "blockquote", content: [paragraphFrom(block)] });
    } else {
      content.push(paragraphFrom(block));
    }
    i += 1;
  }

  return { type: "doc", content };
}
