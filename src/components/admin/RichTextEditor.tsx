"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import type { PortableTextBlock } from "@portabletext/react";

import {
  tiptapToPortableText,
  portableTextToTiptap,
  type TiptapDoc,
} from "@/lib/portable-text/tiptap";

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-(--color-gold) text-(--color-navy)"
          : "text-(--color-text-secondary) hover:text-white hover:bg-(--color-navy-border)"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const url = window.prompt("Link URL");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-(--color-navy-border) p-2">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton label="Image" onClick={addImage}>
        <ImageIcon size={15} />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: PortableTextBlock[];
  onChange: (blocks: PortableTextBlock[]) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    // StarterKit v3 bundles Link — configure it through the kit rather than
    // registering a second Link extension (which would silently double-register).
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image],
    content: portableTextToTiptap(value),
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[280px] px-4 py-3 focus:outline-none text-white font-['DM_Sans'] text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(tiptapToPortableText(editor.getJSON() as TiptapDoc));
    },
  });

  return (
    <div className="bg-(--color-navy) border border-(--color-navy-border) rounded-lg overflow-hidden focus-within:border-(--color-gold)/60 transition-colors">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
