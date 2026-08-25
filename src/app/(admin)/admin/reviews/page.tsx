"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, type AppTableFeatures } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types/review";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabValue = "pending" | "approved" | "hidden";

interface ReviewWithUser extends Review {
  user?: { name: string | null };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
): ColumnDef<AppTableFeatures, ReviewWithUser>[] {
  return [
    {
      id: "reviewer",
      header: "Reviewer",
      cell: ({ row }) => (
        <span className="text-white font-medium whitespace-nowrap">
          {row.original.user?.name ?? `user-${row.original.userId.slice(-4)}`}
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
          {formatDate(getValue<string>())}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isApproved ? (
          <Badge variant="teal" size="sm">
            Approved
          </Badge>
        ) : (
          <Badge variant="gold" size="sm">
            Pending
          </Badge>
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
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<{ data: ReviewWithUser[] }>({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews?all=true");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        console.log("[admin/reviews] API error", res.status, err);
        throw new Error("Failed to fetch reviews");
      }
      const json = (await res.json()) as { data: ReviewWithUser[] };
      console.log("[admin/reviews] API response", json);
      return json;
    },
  });

  const patchMutation = useMutation({
    mutationFn: async ({
      id,
      isApproved,
    }: {
      id: string;
      isApproved: boolean;
    }) => {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: (_, vars) => {
      toast.success(vars.isApproved ? "Review approved." : "Review hidden.");
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (_, vars) =>
      toast.error(vars.isApproved ? "Failed to approve." : "Failed to hide."),
  });

  const reviews = data?.data ?? [];

  const filtered =
    tab === "pending"
      ? reviews.filter((r) => !r.isApproved)
      : tab === "approved"
        ? reviews.filter((r) => r.isApproved)
        : [];

  const columns = buildColumns(
    (id) => patchMutation.mutate({ id, isApproved: true }),
    (id) => patchMutation.mutate({ id, isApproved: false }),
  );

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
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : isError ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-coral)">
            Failed to load reviews — check console for details.
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} />
        )}
      </div>
    </div>
  );
}
