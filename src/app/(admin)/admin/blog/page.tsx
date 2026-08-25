"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTable, type AppTableFeatures } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminPost {
  _id: string;
  title: string;
  slug: string | null;
  author: string | null;
  category: string | null;
  publishedAt: string | null;
  excerpt: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveStatus(publishedAt: string | null): "Published" | "Draft" {
  if (!publishedAt) return "Draft";
  return new Date(publishedAt) <= new Date() ? "Published" : "Draft";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ data: AdminPost[] }>({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<{ data: AdminPost[] }>;
    },
  });

  const posts = data?.data ?? [];

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/sanity/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Post deleted");
      await qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const columns: ColumnDef<AppTableFeatures, AdminPost>[] = [
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
        <span className="text-(--color-text-secondary)">
          {getValue<string | null>() ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        return v ? (
          <Badge variant="ghost" size="sm">
            {v}
          </Badge>
        ) : (
          <span className="text-(--color-text-secondary)">—</span>
        );
      },
    },
    {
      accessorKey: "publishedAt",
      header: "Date",
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        return (
          <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
            {v ? formatDate(v) : "—"}
          </span>
        );
      },
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
            href={`/admin/blog/${row.original._id}`}
            className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.original._id, row.original.title)}
            className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : (
          <DataTable columns={columns} data={posts} />
        )}
      </div>
    </div>
  );
}
