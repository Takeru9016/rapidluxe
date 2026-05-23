"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";
import { dummyReviews } from "@/lib/dummy/reviews";
import type { Review } from "@/types/review";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabValue = "pending" | "approved" | "hidden";

// ── Helpers ───────────────────────────────────────────────────────────────────

function derivePackageName(packageId: string): string {
  return packageId
    .replace("pkg-", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-(--color-gold) text-sm">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

// ── Columns ───────────────────────────────────────────────────────────────────

function buildColumns(
  onApprove: (id: string) => void,
  onHide: (id: string) => void,
): ColumnDef<Review>[] {
  return [
    {
      id: "reviewer",
      header: "Reviewer",
      cell: ({ row }) => (
        <span className="text-white font-medium whitespace-nowrap">
          user-{row.original.userId.slice(-3)}
        </span>
      ),
    },
    {
      id: "package",
      header: "Package",
      cell: ({ row }) => (
        <span className="text-(--color-white-muted) text-sm">
          {derivePackageName(row.original.packageId)}
        </span>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ getValue }) => <StarRating rating={getValue<number>()} />,
    },
    {
      accessorKey: "body",
      header: "Review",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-sm">
          {getValue<string>().slice(0, 60)}…
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
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
      cell: ({ row }) =>
        row.original.isApproved ? (
          <Badge variant="teal" size="sm">Approved</Badge>
        ) : (
          <Badge variant="gold" size="sm">Pending</Badge>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove(row.original.id)}
            className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-teal)/40 text-(--color-teal) hover:bg-(--color-teal)/10 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onHide(row.original.id)}
            className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-coral)/40 text-(--color-coral) hover:bg-(--color-coral)/10 transition-colors"
          >
            Hide
          </button>
        </div>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS: { value: TabValue; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "hidden", label: "Hidden" },
];

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<TabValue>("pending");

  function handleApprove(id: string) {
    console.log("Approve review:", id);
  }

  function handleHide(id: string) {
    console.log("Hide review:", id);
  }

  const filtered =
    tab === "pending"
      ? dummyReviews.filter((r) => !r.isApproved)
      : tab === "approved"
        ? dummyReviews.filter((r) => r.isApproved)
        : [];

  const columns = buildColumns(handleApprove, handleHide);

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Reviews
        </h1>
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
