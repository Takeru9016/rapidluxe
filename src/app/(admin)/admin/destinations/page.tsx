"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { dummyDestinations } from "@/lib/dummy/destinations";
import { dummyPackages } from "@/lib/dummy/packages";
import type { Destination } from "@/types/destination";

// ── Continent label ───────────────────────────────────────────────────────────

const CONTINENT_LABEL: Record<string, string> = {
  ASIA: "Asia",
  EUROPE: "Europe",
  AFRICA: "Africa",
  AMERICAS: "Americas",
  MIDDLE_EAST: "Middle East",
  OCEANIA: "Oceania",
};

// ── Package counts ────────────────────────────────────────────────────────────

const pkgCountByDest = dummyPackages.reduce<Record<string, number>>(
  (acc, p) => ({ ...acc, [p.destinationId]: (acc[p.destinationId] ?? 0) + 1 }),
  {},
);

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<Destination>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const src =
        row.original.imageUrl ??
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=60";
      return (
        <div className="relative w-8 h-8 rounded overflow-hidden shrink-0">
          <Image
            src={src}
            alt={row.original.name}
            fill
            className="object-cover"
            sizes="32px"
          />
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
      <span className="text-(--color-text-secondary)">{getValue<string>()}</span>
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
        {pkgCountByDest[row.original.id] ?? 0}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/destinations/${row.original.id}/edit`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
        >
          <Pencil size={12} />
          Edit
        </Link>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors">
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDestinationsPage() {
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
        <DataTable columns={columns} data={dummyDestinations} />
      </div>
    </div>
  );
}
