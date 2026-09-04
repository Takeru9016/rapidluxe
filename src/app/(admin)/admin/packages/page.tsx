"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ImageOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { type AppTableFeatures, DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import type { ApiPackage } from "@/hooks/api/usePackages";
import { formatPrice } from "@/lib/utils";
import type { PackageStatus } from "@/types/package";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabValue = "all" | PackageStatus;

interface PackagesResponse {
  data: ApiPackage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Status Config ─────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<
  PackageStatus,
  { label: string; variant: "teal" | "ghost" | "coral" }
> = {
  PUBLISHED: { label: "Published", variant: "teal" },
  DRAFT: { label: "Draft", variant: "ghost" },
  ARCHIVED: { label: "Archived", variant: "coral" },
};

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

// ── Columns ───────────────────────────────────────────────────────────────────

function buildColumns(
  onDelete: (pkg: ApiPackage) => void,
): ColumnDef<AppTableFeatures, ApiPackage>[] {
  return [
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const src = row.original.images?.[0];
        return (
          <div className="relative w-8 h-8 rounded overflow-hidden shrink-0 bg-(--color-navy-border) flex items-center justify-center">
            {src ? (
              <Image
                src={src}
                alt={row.original.title}
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : (
              <ImageOff
                size={14}
                aria-label="No image uploaded"
                className="text-(--color-text-secondary)"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-['DM_Sans'] font-medium text-white whitespace-nowrap">
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "destination",
      header: "Destination",
      cell: ({ row }) => (
        <span className="text-(--color-text-secondary) capitalize">
          {row.original.destination?.name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "pricePerPerson",
      header: "Price",
      cell: ({ getValue }) => (
        <span className="font-['JetBrains_Mono'] text-(--color-gold) whitespace-nowrap">
          {formatPrice(getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<PackageStatus>();
        const { label, variant } = STATUS_BADGE[s];
        return (
          <Badge variant={variant} size="sm">
            {label}
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
            href={`/admin/packages/${row.original.id}`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
          >
            <Pencil size={12} />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(row.original)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function AdminPackagesPage() {
  const [tab, setTab] = useState<TabValue>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Debounce the search box so every keystroke doesn't fire a request.
  // Reset to page 1 whenever the debounced value actually changes — an
  // admin filtering to a smaller result set should never land on an
  // out-of-range page from a previous, larger listing.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery<PackagesResponse>({
    queryKey: ["admin-packages", search, tab, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        all: "true",
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (search) params.set("search", search);
      if (tab !== "all") params.set("status", tab);
      const res = await fetch(`/api/packages?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch packages");
      }
      return (await res.json()) as PackagesResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to delete package");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Package deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function handleDelete(pkg: ApiPackage) {
    if (
      !window.confirm(
        `Are you sure you want to delete ${pkg.title}? This cannot be undone.`,
      )
    ) {
      return;
    }
    deleteMutation.mutate(pkg.id);
  }

  const packages = data?.data ?? [];
  const pagination = data?.pagination;
  const columns = buildColumns(handleDelete);

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Packages
        </h1>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          Add New Package
        </Link>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or slug…"
            aria-label="Search packages by title or slug"
            className="w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg pl-9 pr-3 py-2 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${
                tab === value
                  ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                  : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : isError ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-coral)">
            Failed to load packages. Please try again.
          </div>
        ) : packages.length === 0 ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            {search || tab !== "all"
              ? "No packages match your search/filter."
              : "No packages yet."}
          </div>
        ) : (
          <DataTable columns={columns} data={packages} />
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          <span>
            Page {pagination.page} of {pagination.totalPages} —{" "}
            {pagination.total} package{pagination.total !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) disabled:opacity-40 hover:border-(--color-gold)/40 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) disabled:opacity-40 hover:border-(--color-gold)/40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
