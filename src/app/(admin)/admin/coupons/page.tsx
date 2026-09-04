"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { type AppTableFeatures, DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Coupon, CouponDiscountType } from "@/types/coupon";

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

// ── Columns factory ───────────────────────────────────────────────────────────

function buildColumns(
  onToggle: (id: string) => void,
  onEdit: (coupon: Coupon) => void,
  onDelete: (id: string) => void,
): ColumnDef<AppTableFeatures, Coupon>[] {
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
      accessorKey: "discountType",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue<CouponDiscountType>();
        return (
          <Badge variant={type === "PERCENT" ? "ghost" : "gold"} size="sm">
            {type === "PERCENT" ? "%" : "₹"}
          </Badge>
        );
      },
    },
    {
      id: "value",
      header: "Value",
      cell: ({ row }) => (
        <span className="font-['JetBrains_Mono'] text-(--color-gold)">
          {row.original.discountType === "PERCENT"
            ? `${row.original.discountValue}%`
            : formatPrice(row.original.discountValue)}
        </span>
      ),
    },
    {
      accessorKey: "minAmount",
      header: "Min Amount",
      cell: ({ getValue }) => {
        const v = getValue<number | null>();
        return (
          <span className="text-(--color-text-secondary) text-sm">
            {v != null ? formatPrice(v) : "—"}
          </span>
        );
      },
    },
    {
      id: "usage",
      header: "Used / Max",
      cell: ({ row }) => (
        <span className="font-['JetBrains_Mono'] text-sm text-(--color-white-muted)">
          {row.original.usedCount}/{row.original.maxUses ?? "∞"}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expiry",
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        return (
          <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
            {v ? formatDate(v) : "—"}
          </span>
        );
      },
    },
    {
      id: "active",
      header: "Status",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onToggle(row.original.id)}
          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
            row.original.isActive
              ? "bg-(--color-teal)/20 text-(--color-teal) border-(--color-teal)/30"
              : "bg-white/5 text-(--color-text-secondary) border-(--color-navy-border)"
          }`}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
            aria-label={`Edit coupon ${row.original.code}`}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  `Delete coupon "${row.original.code}"? This cannot be undone.`,
                )
              ) {
                onDelete(row.original.id);
              }
            }}
            className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-(--color-coral) transition-colors"
            aria-label={`Delete coupon ${row.original.code}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface CouponForm {
  code: string;
  discountType: CouponDiscountType;
  discountValue: string;
  minAmount: string;
  maxUses: string;
  expiresAt: string;
}

const INITIAL_FORM: CouponForm = {
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  minAmount: "",
  maxUses: "",
  expiresAt: "",
};

function couponToForm(coupon: Coupon): CouponForm {
  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: String(coupon.discountValue),
    minAmount: coupon.minAmount != null ? String(coupon.minAmount) : "",
    maxUses: coupon.maxUses != null ? String(coupon.maxUses) : "",
    expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
  };
}

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(INITIAL_FORM);

  const { data, isLoading } = useQuery<{ data: Coupon[] }>({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Failed to fetch coupons");
      return res.json() as Promise<{ data: Coupon[] }>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      code: string;
      discountType: CouponDiscountType;
      discountValue: number;
      minAmount?: number;
      maxUses?: number;
      expiresAt?: string;
    }) => {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to create coupon");
      }
    },
    onSuccess: () => {
      toast.success("Coupon created.");
      void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setForm(INITIAL_FORM);
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      discountValue: number;
      minAmount?: number | null;
      maxUses?: number | null;
      expiresAt?: string | null;
    }) => {
      const { id, ...body } = payload;
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to update coupon");
      }
    },
    onSuccess: () => {
      toast.success("Coupon updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setForm(INITIAL_FORM);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: () => toast.error("Failed to update coupon."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Coupon deleted.");
      void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: () => toast.error("Failed to delete coupon."),
  });

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        discountValue: Number(form.discountValue),
        minAmount: form.minAmount ? Number(form.minAmount) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      });
      return;
    }
    createMutation.mutate({
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minAmount: form.minAmount ? Number(form.minAmount) : undefined,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      expiresAt: form.expiresAt || undefined,
    });
  }

  function startEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm(couponToForm(coupon));
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  const coupons = data?.data ?? [];
  const columns = buildColumns(
    (id) => toggleMutation.mutate(id),
    startEdit,
    (id) => deleteMutation.mutate(id),
  );
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Coupons
        </h1>
        <button
          type="button"
          onClick={() => (showForm ? cancelForm() : setShowForm(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Coupon"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : (
          <DataTable columns={columns} data={coupons} />
        )}
      </div>

      {/* Add / Edit Coupon Form */}
      {showForm && (
        <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 mt-6">
          <h2 className="font-['Cormorant_Garamond'] text-xl text-(--color-gold) mb-4">
            {editingId ? `Edit Coupon — ${form.code}` : "Add Coupon"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="coupon-code"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Code
              </label>
              <input
                id="coupon-code"
                type="text"
                placeholder="e.g. SUMMER20"
                value={form.code}
                disabled={!!editingId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                className={`${INPUT_CLASS} disabled:opacity-50`}
                required
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="coupon-type"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Type
              </label>
              <select
                id="coupon-type"
                value={form.discountType}
                disabled={!!editingId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discountType: e.target.value as CouponDiscountType,
                  }))
                }
                className={`${INPUT_CLASS} disabled:opacity-50`}
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FIXED">Fixed (₹)</option>
              </select>
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="coupon-value"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Value
              </label>
              <input
                id="coupon-value"
                type="number"
                min={1}
                max={form.discountType === "PERCENT" ? 100 : undefined}
                placeholder={
                  form.discountType === "PERCENT" ? "e.g. 20" : "e.g. 5000"
                }
                value={form.discountValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountValue: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Min Amount */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="coupon-min-amount"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Min Amount (₹)
              </label>
              <input
                id="coupon-min-amount"
                type="number"
                min={0}
                placeholder="e.g. 50000"
                value={form.minAmount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minAmount: e.target.value }))
                }
                className={INPUT_CLASS}
              />
            </div>

            {/* Max Uses */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="coupon-max-uses"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Max Uses
              </label>
              <input
                id="coupon-max-uses"
                type="number"
                min={1}
                placeholder="e.g. 100"
                value={form.maxUses}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxUses: e.target.value }))
                }
                className={INPUT_CLASS}
              />
            </div>

            {/* Expiry */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="coupon-expiry"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Expiry Date
              </label>
              <input
                id="coupon-expiry"
                type="date"
                min={todayStr}
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiresAt: e.target.value }))
                }
                className={INPUT_CLASS}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors disabled:opacity-50"
              >
                {isSaving
                  ? "Saving…"
                  : editingId
                    ? "Save Changes"
                    : "Create Coupon"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) text-sm font-['DM_Sans'] font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
