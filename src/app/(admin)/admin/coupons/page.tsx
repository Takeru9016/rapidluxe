"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { dummyCoupons } from "@/lib/dummy/coupons";
import type { Coupon, CouponType } from "@/types/coupon";

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

// ── Columns factory ───────────────────────────────────────────────────────────

function buildColumns(
  coupons: Coupon[],
  onToggle: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<Coupon>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ getValue }) => (
        <span className="font-['JetBrains_Mono'] font-bold text-white">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue<CouponType>();
        return (
          <Badge variant={type === "PERCENTAGE" ? "ghost" : "gold"} size="sm">
            {type === "PERCENTAGE" ? "%" : "₹"}
          </Badge>
        );
      },
    },
    {
      id: "value",
      header: "Value",
      cell: ({ row }) => (
        <span className="font-['JetBrains_Mono'] text-(--color-gold)">
          {row.original.type === "PERCENTAGE"
            ? `${row.original.value}%`
            : formatPrice(row.original.value)}
        </span>
      ),
    },
    {
      accessorKey: "minAmount",
      header: "Min Amount",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-sm">
          {formatPrice(getValue<number>())}
        </span>
      ),
    },
    {
      id: "usage",
      header: "Used / Max",
      cell: ({ row }) => (
        <span className="font-['JetBrains_Mono'] text-sm text-(--color-white-muted)">
          {row.original.usedCount}/{row.original.maxUses}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expiry",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
          {formatDate(getValue<Date>())}
        </span>
      ),
    },
    {
      id: "active",
      header: "Status",
      cell: ({ row }) => {
        const coupon = coupons.find((c) => c.id === row.original.id) ?? row.original;
        return (
          <button
            onClick={() => onToggle(row.original.id)}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
              coupon.isActive
                ? "bg-(--color-teal)/20 text-(--color-teal) border-(--color-teal)/30"
                : "bg-white/5 text-(--color-text-secondary) border-(--color-navy-border)"
            }`}
          >
            {coupon.isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    {
      id: "delete",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => onDelete(row.original.id)}
          className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-(--color-coral) transition-colors"
          aria-label="Delete coupon"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface NewCouponForm {
  code: string;
  type: CouponType;
  value: string;
  minAmount: string;
  maxUses: string;
  expiresAt: string;
}

const INITIAL_FORM: NewCouponForm = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minAmount: "",
  maxUses: "",
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(dummyCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewCouponForm>(INITIAL_FORM);

  function handleToggle(id: string) {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );
  }

  function handleDelete(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minAmount: Number(form.minAmount),
      maxUses: Number(form.maxUses),
      usedCount: 0,
      expiresAt: new Date(form.expiresAt),
      isActive: true,
    };
    console.log("Create coupon:", newCoupon);
    setCoupons((prev) => [...prev, newCoupon]);
    setForm(INITIAL_FORM);
    setShowForm(false);
  }

  const columns = buildColumns(coupons, handleToggle, handleDelete);

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Coupons
        </h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Coupon"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={coupons} />
      </div>

      {/* Add Coupon Form */}
      {showForm && (
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 mt-6">
          <h2 className="font-['Cormorant_Garamond'] text-xl text-(--color-gold) mb-4">
            Add Coupon
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                Code
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponType }))}
                className={INPUT_CLASS}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed (₹)</option>
              </select>
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                Value
              </label>
              <input
                type="number"
                min={1}
                placeholder={form.type === "PERCENTAGE" ? "e.g. 20" : "e.g. 5000"}
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Min Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                Min Amount (₹)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 50000"
                value={form.minAmount}
                onChange={(e) => setForm((f) => ({ ...f, minAmount: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Max Uses */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                Max Uses
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 100"
                value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Expiry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
