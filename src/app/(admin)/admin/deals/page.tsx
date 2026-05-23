"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";
import { dummyDeals } from "@/lib/dummy/deals";
import { dummyPackages } from "@/lib/dummy/packages";
import type { Deal, DealType } from "@/types/deal";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEAL_TYPE_LABEL: Record<DealType, string> = {
  FLASH_SALE: "Flash Sale",
  EARLY_BIRD: "Early Bird",
  LAST_MINUTE: "Last Minute",
  SEASONAL: "Seasonal",
};

const INPUT_CLASS =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

// ── SectionCard ───────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 mt-6">
      <h2 className="font-['Cormorant_Garamond'] text-xl text-(--color-gold) mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<Deal>[] = [
  {
    id: "package",
    header: "Package",
    cell: ({ row }) => {
      const pkg = dummyPackages.find((p) => p.id === row.original.packageId);
      return <span className="text-white font-medium">{pkg?.title ?? row.original.packageId}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => (
      <Badge variant="ghost" size="sm">
        {DEAL_TYPE_LABEL[getValue<DealType>()]}
      </Badge>
    ),
  },
  {
    accessorKey: "discountPct",
    header: "Discount",
    cell: ({ getValue }) => (
      <span className="font-['JetBrains_Mono'] text-(--color-gold)">
        {getValue<number>()}%
      </span>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ getValue }) => (
      <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
        {formatDate(getValue<Date>())}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => (
      <span className={getValue<boolean>() ? "text-(--color-teal)" : "text-(--color-text-secondary)"}>
        ●
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors">
          Edit
        </button>
        <button className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors">
          Delete
        </button>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDealsPage() {
  const [showForm, setShowForm] = useState(false);

  const [dealForm, setDealForm] = useState({
    packageId: dummyPackages[0]?.id ?? "",
    type: "FLASH_SALE" as DealType,
    discountPct: 10,
    expiresAt: "",
    isActive: true,
  });

  function handleSaveDeal() {
    console.log("Save deal:", dealForm);
    setShowForm(false);
  }

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Deals
        </h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Create Deal"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={dummyDeals} />
      </div>

      {/* Create Deal Form */}
      {showForm && (
        <SectionCard title="Create Deal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Package */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">Package</label>
              <select
                value={dealForm.packageId}
                onChange={(e) => setDealForm((f) => ({ ...f, packageId: e.target.value }))}
                className={INPUT_CLASS}
              >
                {dummyPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">Deal Type</label>
              <select
                value={dealForm.type}
                onChange={(e) => setDealForm((f) => ({ ...f, type: e.target.value as DealType }))}
                className={INPUT_CLASS}
              >
                {(Object.keys(DEAL_TYPE_LABEL) as DealType[]).map((t) => (
                  <option key={t} value={t}>{DEAL_TYPE_LABEL[t]}</option>
                ))}
              </select>
            </div>

            {/* Discount % */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">Discount %</label>
              <input
                type="number"
                min={1}
                max={100}
                value={dealForm.discountPct}
                onChange={(e) => setDealForm((f) => ({ ...f, discountPct: Number(e.target.value) }))}
                className={INPUT_CLASS}
              />
            </div>

            {/* Expiry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">Expiry Date</label>
              <input
                type="date"
                value={dealForm.expiresAt}
                onChange={(e) => setDealForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                id="deal-active"
                type="checkbox"
                checked={dealForm.isActive}
                onChange={(e) => setDealForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-(--color-gold)"
              />
              <label htmlFor="deal-active" className="text-sm font-['DM_Sans'] text-(--color-white-muted)">
                Active
              </label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleSaveDeal}
                className="px-6 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors"
              >
                Save Deal
              </button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
