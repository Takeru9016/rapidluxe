"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/shared/Badge";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SanityCategory {
  _id: string;
  title: string;
  slug: string | null;
  description: string | null;
  postCount: number;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

function toSlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── New Category Form ─────────────────────────────────────────────────────────

function NewCategoryForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugManual) setSlug(toSlug(v));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sanity/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, description }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      toast.success("Category created");
      await qc.invalidateQueries({ queryKey: ["admin-categories"] });
      onClose();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-gold)/30 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-['DM_Sans'] text-sm font-semibold uppercase tracking-widest text-(--color-gold)">
          New Category
        </h2>
        <button
          onClick={onClose}
          className="text-(--color-white-muted) hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Destination Guide"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              placeholder="auto-generated"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short description…"
              className={inputCls + " resize-none"}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="px-5 py-2 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBlogCategoriesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<{ data: SanityCategory[] }>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/categories");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: SanityCategory[] }>;
    },
  });

  const categories = data?.data ?? [];

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete category "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/sanity/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Category deleted");
      await qc.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Blog Categories
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
          >
            <Plus size={16} />
            New Category
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && <NewCategoryForm onClose={() => setShowForm(false)} />}

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-hidden">
        {isLoading ? (
          <p className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </p>
        ) : categories.length === 0 ? (
          <p className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            No categories yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--color-navy-border)">
                {["Title", "Slug", "Description", "Posts", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-text-secondary)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c._id}
                  className="border-b border-(--color-navy-border) last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3 font-['DM_Sans'] text-white font-medium">
                    {c.title}
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-['JetBrains_Mono'] text-xs text-(--color-gold) bg-(--color-gold)/10 px-2 py-0.5 rounded">
                      {c.slug ?? "—"}
                    </code>
                  </td>
                  <td className="px-4 py-3 font-['DM_Sans'] text-(--color-text-secondary) max-w-xs">
                    <span className="line-clamp-2">{c.description ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="ghost" size="sm">
                      {c.postCount}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(c._id, c.title)}
                      className="p-1.5 rounded-md text-(--color-white-muted) hover:text-(--color-coral) hover:bg-(--color-coral)/10 transition-colors"
                      aria-label="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
