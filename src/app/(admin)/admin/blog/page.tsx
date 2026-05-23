// Phase 2E: wired to Sanity API
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";
import { dummyBlogPosts, type BlogPost } from "@/lib/dummy/blog";

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveStatus(publishedAt: Date): "Published" | "Draft" {
  return new Date(publishedAt) <= new Date() ? "Published" : "Draft";
}

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => (
      <span className="text-white font-medium truncate max-w-[220px] block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ getValue }) => (
      <span className="text-(--color-text-secondary)">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => (
      <Badge variant="ghost" size="sm">
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: "publishedAt",
    header: "Date",
    cell: ({ getValue }) => (
      <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
        {formatDate(getValue<Date>())}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = deriveStatus(row.original.publishedAt);
      return (
        <Badge variant={status === "Published" ? "teal" : "ghost"} size="sm">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/blog/${row.original.id}/edit`}
          className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
        >
          Edit
        </Link>
        <button className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors">
          Unpublish
        </button>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Blog Posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={dummyBlogPosts} />
      </div>
    </div>
  );
}
