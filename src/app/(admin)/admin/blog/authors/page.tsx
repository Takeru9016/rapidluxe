"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SanityAuthor {
  _id: string;
  name: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

// ── New Author Form ───────────────────────────────────────────────────────────

function NewAuthorForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/sanity/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, bio, imageUrl }),
      });
      if (!res.ok) throw new Error("Failed to create author");
      toast.success("Author created");
      await qc.invalidateQueries({ queryKey: ["admin-authors"] });
      onClose();
    } catch {
      toast.error("Failed to create author");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-gold)/30 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-['DM_Sans'] text-sm font-semibold uppercase tracking-widest text-(--color-gold)">
          New Author
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
            <label
              htmlFor="author-name"
              className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
            >
              Name *
            </label>
            <input
              id="author-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Siddhesh Sood"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label
              htmlFor="author-role"
              className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
            >
              Role
            </label>
            <input
              id="author-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder & CEO"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="author-bio"
              className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
            >
              Bio
            </label>
            <textarea
              id="author-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Short author bio…"
              className={inputCls + " resize-none"}
            />
          </div>
          <div className="sm:col-span-2">
            <span className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
              Photo
            </span>
            <CloudinaryUpload
              folder="rapidluxe/authors"
              currentUrl={imageUrl}
              onUpload={setImageUrl}
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
            disabled={saving || !name.trim()}
            className="px-5 py-2 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create Author"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBlogAuthorsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<{ data: SanityAuthor[] }>({
    queryKey: ["admin-authors"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/authors");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: SanityAuthor[] }>;
    },
  });

  const authors = data?.data ?? [];

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete author "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/sanity/authors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(err?.error ?? "Failed to delete author");
      }
      toast.success("Author deleted");
      await qc.invalidateQueries({ queryKey: ["admin-authors"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete author");
    }
  };

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Blog Authors
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
          >
            <Plus size={16} />
            New Author
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && <NewAuthorForm onClose={() => setShowForm(false)} />}

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-hidden">
        {isLoading ? (
          <p className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </p>
        ) : authors.length === 0 ? (
          <p className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            No authors yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--color-navy-border)">
                {["Avatar", "Name", "Role", "Bio", ""].map((h) => (
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
              {authors.map((a) => (
                <tr
                  key={a._id}
                  className="border-b border-(--color-navy-border) last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3">
                    {a.imageUrl ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={a.imageUrl}
                          alt={a.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-(--color-navy) border border-(--color-navy-border) flex items-center justify-center text-(--color-text-secondary) font-['DM_Sans'] text-sm font-bold">
                        {a.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-['DM_Sans'] text-white font-medium">
                    {a.name}
                  </td>
                  <td className="px-4 py-3 font-['DM_Sans'] text-(--color-text-secondary)">
                    {a.role ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-['DM_Sans'] text-(--color-text-secondary) max-w-xs">
                    <span className="line-clamp-2">{a.bio ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(a._id, a.name)}
                      className="p-1.5 rounded-md text-(--color-white-muted) hover:text-(--color-coral) hover:bg-(--color-coral)/10 transition-colors"
                      aria-label="Delete author"
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
