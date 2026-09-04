"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { type AppTableFeatures, DataTable } from "@/components/admin/DataTable";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminDestination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: string;
  imageUrl: string | null;
  _count: { packages: number };
}

// ── Continent label ───────────────────────────────────────────────────────────

const CONTINENT_LABEL: Record<string, string> = {
  ASIA: "Asia",
  EUROPE: "Europe",
  AFRICA: "Africa",
  AMERICAS: "Americas",
  MIDDLE_EAST: "Middle East",
  OCEANIA: "Oceania",
};

// ── Columns ───────────────────────────────────────────────────────────────────

function buildColumns(
  onDelete: (destination: AdminDestination) => void,
): ColumnDef<AppTableFeatures, AdminDestination>[] {
  return [
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const src = row.original.imageUrl;
        return (
          <div className="relative w-8 h-8 rounded overflow-hidden shrink-0 bg-(--color-navy-border) flex items-center justify-center">
            {src ? (
              <Image
                src={src}
                alt={row.original.name}
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
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-['DM_Sans'] font-medium text-white whitespace-nowrap">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary)">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "continent",
      header: "Continent",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary)">
          {CONTINENT_LABEL[getValue<string>()] ?? getValue<string>()}
        </span>
      ),
    },
    {
      id: "packages",
      header: "Packages",
      cell: ({ row }) => (
        <span className="font-['JetBrains_Mono'] text-sm text-(--color-gold)">
          {row.original._count.packages}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/destinations/${row.original.id}`}
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

export default function AdminDestinationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<{ data: AdminDestination[] }>({
    queryKey: ["admin-destinations"],
    queryFn: async () => {
      const res = await fetch("/api/destinations");
      if (!res.ok) {
        throw new Error("Failed to fetch destinations");
      }
      return (await res.json()) as { data: AdminDestination[] };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to delete destination");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Destination deleted");
      void queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function handleDelete(destination: AdminDestination) {
    if (
      !window.confirm(
        `Are you sure you want to delete ${destination.name}? This cannot be undone.`,
      )
    ) {
      return;
    }
    deleteMutation.mutate(destination.id);
  }

  const columns = buildColumns(handleDelete);
  const destinations = data?.data ?? [];

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Destinations
        </h1>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          Add Destination
        </Link>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : isError ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-coral)">
            Failed to load destinations — check console for details.
          </div>
        ) : (
          <DataTable columns={columns} data={destinations} />
        )}
      </div>
    </div>
  );
}
