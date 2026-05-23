"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { formatDate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────

const dummyEnquiries: Enquiry[] = [
  { id: "enq-001", name: "Rohit Bansal", email: "rohit.bansal@gmail.com", subject: "Custom Maldives honeymoon package", message: "Hi, my wife and I are celebrating our first anniversary in December. We are looking for a 7-night Maldives package with overwater villa, candlelight dinners, and a spa day. Budget is around ₹4 lakhs for 2 people. Can you customise something for us?", date: "2025-05-18", isRead: true },
  { id: "enq-002", name: "Deepika Rao", email: "deepika.rao@outlook.com", subject: "Group trip to Rajasthan for 12 people", message: "We are a group of 12 colleagues planning a 5-day Rajasthan trip in October. We need heritage hotel stays, private transport, and a folk evening with dinner. Please share group pricing.", date: "2025-05-19", isRead: false },
  { id: "enq-003", name: "Aditya Kumar", email: "aditya.k@email.com", subject: "Is Switzerland package available in August?", message: "I checked the Switzerland Alpine Dream package and it looks perfect. We are 2 adults planning for August 15-22. Is availability confirmed for those dates? Also, do you handle visa assistance?", date: "2025-05-20", isRead: false },
  { id: "enq-004", name: "Lakshmi Iyer", email: "lakshmi.iyer@gmail.com", subject: "Corporate retreat for 30 people — Bali", message: "Our company is planning an annual offsite in Bali for 30 employees this November. We need resort accommodation, team activities, and conference facilities for half-days. Looking for a full turnkey solution.", date: "2025-05-21", isRead: true },
  { id: "enq-005", name: "Farhan Sheikh", email: "farhan.sheikh@gmail.com", subject: "Budget-friendly Kerala package", message: "I saw the Kerala Backwaters Bliss package. Is there a more budget-friendly version without the houseboat? We are 2 adults + 1 child for 5 nights in September. Please advise.", date: "2025-05-22", isRead: false },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(dummyEnquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggleRead(id: string) {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: !e.isRead } : e)),
    );
  }

  function handleView(id: string) {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e)),
    );
    setExpandedId((prev) => (prev === id ? null : id));
  }

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
        <span className="text-(--color-text-secondary) text-sm">{getValue<string>()}</span>
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
      accessorKey: "date",
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
        const enq = enquiries.find((e) => e.id === row.original.id) ?? row.original;
        return (
          <button
            onClick={() => handleToggleRead(row.original.id)}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
              enq.isRead
                ? "text-(--color-text-secondary) border-(--color-navy-border)"
                : "text-(--color-gold) border-(--color-gold)/40 hover:bg-(--color-gold)/10"
            }`}
          >
            {enq.isRead ? "Read ✓" : "Mark Read"}
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
        <DataTable columns={columns} data={enquiries} />
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
                From <span className="text-(--color-white-muted)">{expandedEnquiry.name}</span>{" "}
                &lt;{expandedEnquiry.email}&gt; · {formatDate(expandedEnquiry.date)}
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
