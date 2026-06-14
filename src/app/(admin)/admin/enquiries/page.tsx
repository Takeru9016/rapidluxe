"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { formatDate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminEnquiriesPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ data: Enquiry[] }>({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const res = await fetch("/api/admin/enquiries");
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      return res.json() as Promise<{ data: Enquiry[] }>;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: () => toast.error("Failed to mark as read."),
  });

  function handleView(id: string) {
    markReadMutation.mutate(id);
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const enquiries = data?.data ?? [];
  const expandedEnquiry = enquiries.find((e) => e.id === expandedId);

  const columns: ColumnDef<Enquiry>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="text-white font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ getValue }) => (
        <span className="text-white text-sm truncate max-w-[200px] block">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "message",
      header: "Preview",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-xs">
          {getValue<string>().slice(0, 50)}…
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
      id: "readStatus",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.original.isRead;
        return (
          <button
            onClick={() => {
              if (!isRead) markReadMutation.mutate(row.original.id);
            }}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
              isRead
                ? "text-(--color-text-secondary) border-(--color-navy-border) cursor-default"
                : "text-(--color-gold) border-(--color-gold)/40 hover:bg-(--color-gold)/10"
            }`}
          >
            {isRead ? "Read ✓" : "Mark Read"}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleView(row.original.id)}
          className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Enquiries
        </h1>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : (
          <DataTable columns={columns} data={enquiries} />
        )}
      </div>

      {/* Expanded Message */}
      {expandedEnquiry && (
        <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6 mt-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-1">
                {expandedEnquiry.subject}
              </h2>
              <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                From{" "}
                <span className="text-(--color-white-muted)">
                  {expandedEnquiry.name}
                </span>{" "}
                &lt;{expandedEnquiry.email}&gt; ·{" "}
                {formatDate(expandedEnquiry.createdAt)}
              </p>
            </div>
            <button
              onClick={() => setExpandedId(null)}
              className="px-3 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-text-secondary) hover:text-white transition-colors shrink-0"
            >
              Close
            </button>
          </div>
          <p className="font-['DM_Sans'] text-sm text-(--color-white-muted) leading-relaxed">
            {expandedEnquiry.message}
          </p>
        </div>
      )}
    </div>
  );
}
