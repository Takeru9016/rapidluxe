"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Archive } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatPrice } from "@/lib/utils";
import { dummyPackages } from "@/lib/dummy/packages";
import type { Package, PackageStatus } from "@/types/package";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabValue = "all" | PackageStatus;

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

const columns: ColumnDef<Package>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const src =
        row.original.images?.[0] ??
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=60";
      return (
        <div className="relative w-8 h-8 rounded overflow-hidden shrink-0">
          <Image src={src} alt={row.original.title} fill className="object-cover" sizes="32px" />
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
    accessorKey: "destinationId",
    header: "Destination",
    cell: ({ getValue }) => (
      <span className="text-(--color-text-secondary) capitalize">
        {getValue<string>().replace("dest-", "").replace(/-/g, " ")}
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
      return <Badge variant={variant} size="sm">{label}</Badge>;
    },
  },
  {
    id: "rating",
    header: "Rating",
    cell: () => (
      <span className="font-['JetBrains_Mono'] text-sm text-white">
        4.8 ★
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/packages/${row.original.id}/edit`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
        >
          <Pencil size={12} />
          Edit
        </Link>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors">
          <Archive size={12} />
          Archive
        </button>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPackagesPage() {
  const [tab, setTab] = useState<TabValue>("all");

  const filtered =
    tab === "all"
      ? dummyPackages
      : dummyPackages.filter((p) => p.status === tab);

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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
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

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
