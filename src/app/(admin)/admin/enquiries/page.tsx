"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Mail, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/shared/Badge";
import { formatDate, truncate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type EnquiryType = "CORPORATE" | "GENERAL";
type EnquiryStatus = "OPEN" | "RESOLVED";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  type: EnquiryType;
  status: EnquiryStatus;
  createdAt: string;
  isRead: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminEnquiriesPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Enquiry marked as resolved");
      void queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: () => toast.error("Failed to mark as resolved."),
  });

  const enquiries = data?.data ?? [];

  const sorted = useMemo(
    () =>
      [...enquiries].sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }),
    [enquiries],
  );

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  function handleSelect(enquiry: Enquiry) {
    setSelectedId(enquiry.id);
    if (!enquiry.isRead) markReadMutation.mutate(enquiry.id);
  }

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Enquiries
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left panel — list ── */}
        <div className="w-full lg:w-[35%] shrink-0 space-y-2">
          {isLoading ? (
            <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              Loading…
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
              No enquiries yet.
            </div>
          ) : (
            sorted.map((enquiry) => (
              <button
                key={enquiry.id}
                type="button"
                onClick={() => handleSelect(enquiry)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${
                  selectedId === enquiry.id
                    ? "border-(--color-gold)/60 bg-(--color-gold)/5"
                    : enquiry.isRead
                      ? "border-(--color-navy-border) bg-(--color-navy-surface) hover:border-(--color-gold)/30"
                      : "border-(--color-navy-border) bg-(--color-navy-border)/30 hover:border-(--color-gold)/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="min-w-0">
                    <p className="font-['DM_Sans'] text-sm font-medium text-white truncate">
                      {enquiry.name}
                    </p>
                    <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) truncate">
                      {enquiry.email}
                    </p>
                  </div>
                  {!enquiry.isRead && (
                    <span className="w-2 h-2 rounded-full bg-(--color-gold) shrink-0 mt-1" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={enquiry.type === "CORPORATE" ? "teal" : "gold"}
                    size="sm"
                  >
                    {enquiry.type === "CORPORATE" ? "Corporate" : "General"}
                  </Badge>
                  <span className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                    {timeAgo(enquiry.createdAt)}
                  </span>
                </div>
                <p className="text-xs font-['DM_Sans'] text-(--color-white-muted) line-clamp-2">
                  {truncate(enquiry.message, 60)}
                </p>
              </button>
            ))
          )}
        </div>

        {/* ── Right panel — detail ── */}
        <div className="w-full lg:w-[65%]">
          {selected ? (
            <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={selected.type === "CORPORATE" ? "teal" : "gold"}
                      size="sm"
                    >
                      {selected.type === "CORPORATE" ? "Corporate" : "General"}
                    </Badge>
                    <Badge
                      variant={
                        selected.status === "RESOLVED" ? "teal" : "coral"
                      }
                      size="sm"
                    >
                      {selected.status === "RESOLVED" ? "Resolved" : "Open"}
                    </Badge>
                  </div>
                  <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-1">
                    {selected.name}
                  </h2>
                  <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                    {selected.email}
                    {selected.phone ? ` · ${selected.phone}` : ""} ·{" "}
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
                {!selected.isRead && (
                  <button
                    type="button"
                    onClick={() => markReadMutation.mutate(selected.id)}
                    className="px-4 py-2 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors shrink-0"
                  >
                    Mark as Read
                  </button>
                )}
              </div>

              <div className="bg-(--color-navy-surface) p-6 rounded-xl border border-(--color-navy-border) mb-5">
                <p className="font-['DM_Sans'] text-sm text-(--color-white-muted) leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your RapidLuxe Enquiry`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] hover:bg-(--color-gold)/10 transition-colors"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hi ${selected.name}, thank you for reaching out to RapidLuxe.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-teal)/40 text-(--color-teal) text-sm font-['DM_Sans'] hover:bg-(--color-teal)/10 transition-colors"
                  >
                    <Phone size={14} />
                    WhatsApp
                  </a>
                )}
                {selected.status !== "RESOLVED" && (
                  <button
                    type="button"
                    onClick={() => resolveMutation.mutate(selected.id)}
                    disabled={resolveMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) text-sm font-['DM_Sans'] hover:text-white hover:border-(--color-gold)/40 transition-colors disabled:opacity-50"
                  >
                    <MessageCircle size={14} />
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-12">
              <Inbox size={40} className="text-(--color-gold)/30 mb-4" />
              <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
                Select an enquiry to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
