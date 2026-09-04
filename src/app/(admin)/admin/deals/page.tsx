"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, type AppTableFeatures } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import type { ApiDeal } from "@/hooks/api/useDeals";
import { formatDate, formatPrice } from "@/lib/utils";
import type { DealType } from "@/types/deal";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEAL_TYPE_LABEL: Record<DealType, string> = {
  FLASH_SALE: "Flash Sale",
  EARLY_BIRD: "Early Bird",
  LAST_MINUTE: "Last Minute",
  SEASONAL: "Seasonal",
};

const INPUT_CLASS =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

interface PackageOption {
  id: string;
  title: string;
  pricePerPerson: number;
  destination: { name: string };
}

interface DealForm {
  packageId: string;
  type: DealType;
  discountPct: string;
  expiresAt: string;
  isActive: boolean;
}

const INITIAL_FORM: DealForm = {
  packageId: "",
  type: "FLASH_SALE",
  discountPct: "10",
  expiresAt: "",
  isActive: true,
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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

// ── Columns factory ───────────────────────────────────────────────────────────

function buildColumns(
  onToggle: (id: string) => void,
  onEdit: (deal: ApiDeal) => void,
  onDelete: (id: string) => void,
): ColumnDef<AppTableFeatures, ApiDeal>[] {
  return [
    {
      id: "package",
      header: "Package",
      cell: ({ row }) => (
        <span className="text-white font-medium">
          {row.original.package?.title ?? row.original.packageId}
        </span>
      ),
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
      id: "dealPrice",
      header: "Deal Price",
      cell: ({ row }) => {
        const pkg = row.original.package;
        if (!pkg)
          return <span className="text-(--color-text-secondary)">—</span>;
        const dealPrice =
          pkg.pricePerPerson * (1 - row.original.discountPct / 100);
        return (
          <span className="font-['JetBrains_Mono'] text-sm text-white">
            {formatPrice(dealPrice)}
          </span>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
          {formatDate(getValue<string>())}
        </span>
      ),
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
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
            aria-label="Edit deal"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete this deal? This cannot be undone.")) {
                onDelete(row.original.id);
              }
            }}
            className="p-1.5 rounded-md text-(--color-text-secondary) hover:text-(--color-coral) transition-colors"
            aria-label="Delete deal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDealsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DealForm>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: dealsData, isLoading } = useQuery<{ data: ApiDeal[] }>({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/deals");
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json() as Promise<{ data: ApiDeal[] }>;
    },
  });

  const { data: packagesData } = useQuery<{ data: PackageOption[] }>({
    queryKey: ["packages-for-select"],
    queryFn: async () => {
      const res = await fetch("/api/packages?all=true");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json() as Promise<{ data: PackageOption[] }>;
    },
  });

  const deals = dealsData?.data ?? [];
  const packages = packagesData?.data ?? [];
  const selectedPackage = packages.find((p) => p.id === form.packageId);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      packageId: string;
      type: DealType;
      discountPct: number;
      expiresAt: string;
      isActive: boolean;
    }) => {
      const url = editingId
        ? `/api/admin/deals/${editingId}`
        : "/api/admin/deals";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to save deal");
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Deal updated." : "Deal created.");
      void queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      void queryClient.invalidateQueries({ queryKey: ["deals"] });
      resetForm();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/deals/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      void queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
    onError: () => toast.error("Failed to update deal."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Deal deleted.");
      void queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      void queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
    onError: () => toast.error("Failed to delete deal."),
  });

  function resetForm() {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setFormError(null);
    setShowForm(false);
  }

  function handleEdit(deal: ApiDeal) {
    setEditingId(deal.id);
    setForm({
      packageId: deal.packageId,
      type: deal.type,
      discountPct: String(deal.discountPct),
      expiresAt: toDatetimeLocal(deal.expiresAt),
      isActive: deal.isActive,
    });
    setFormError(null);
    setShowForm(true);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setFormError(null);

    if (!form.packageId) {
      setFormError("Select a package.");
      return;
    }
    if (new Date(form.expiresAt) <= new Date()) {
      setFormError("Expiry date must be in the future.");
      return;
    }

    saveMutation.mutate({
      packageId: form.packageId,
      type: form.type,
      discountPct: Number(form.discountPct),
      expiresAt: new Date(form.expiresAt).toISOString(),
      isActive: form.isActive,
    });
  }

  const columns = buildColumns(
    (id) => toggleMutation.mutate(id),
    handleEdit,
    (id) => deleteMutation.mutate(id),
  );

  const discountPctNum = Number(form.discountPct) || 0;
  const dealPricePreview = selectedPackage
    ? selectedPackage.pricePerPerson * (1 - discountPctNum / 100)
    : null;

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Deals
        </h1>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-coral) text-white text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/90 transition-colors"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "New Deal"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
            Loading…
          </div>
        ) : (
          <DataTable columns={columns} data={deals} />
        )}
      </div>

      {/* Create / Edit Deal Form */}
      {showForm && (
        <SectionCard title={editingId ? "Edit Deal" : "Create Deal"}>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Package */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label
                htmlFor="deal-package"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Package
              </label>
              <select
                id="deal-package"
                value={form.packageId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, packageId: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              >
                <option value="">Select a package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} — {pkg.destination.name} (
                    {formatPrice(pkg.pricePerPerson)})
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="deal-type"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Deal Type
              </label>
              <select
                id="deal-type"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as DealType }))
                }
                className={INPUT_CLASS}
              >
                {(Object.keys(DEAL_TYPE_LABEL) as DealType[]).map((t) => (
                  <option key={t} value={t}>
                    {DEAL_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount % */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="deal-discount-pct"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Discount %
              </label>
              <input
                id="deal-discount-pct"
                type="number"
                min={1}
                max={100}
                value={form.discountPct}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountPct: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Deal price preview */}
            {dealPricePreview !== null && (
              <div className="md:col-span-2 text-sm font-['DM_Sans'] text-(--color-white-muted)">
                <span className="line-through mr-2">
                  {formatPrice(selectedPackage!.pricePerPerson)}
                </span>
                <span className="text-(--color-gold) font-['JetBrains_Mono']">
                  {formatPrice(dealPricePreview)}
                </span>
                <span className="ml-2 text-(--color-teal)">
                  ({discountPctNum}% off)
                </span>
              </div>
            )}

            {/* Expiry */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label
                htmlFor="deal-expires-at"
                className="text-xs font-['DM_Sans'] text-(--color-text-secondary)"
              >
                Expires At
              </label>
              <input
                id="deal-expires-at"
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiresAt: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                id="deal-active"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="w-4 h-4 accent-(--color-gold)"
              />
              <label
                htmlFor="deal-active"
                className="text-sm font-['DM_Sans'] text-(--color-white-muted)"
              >
                Active
              </label>
            </div>

            {formError && (
              <p className="md:col-span-2 text-sm text-(--color-coral) font-['DM_Sans']">
                {formError}
              </p>
            )}

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending
                  ? "Saving…"
                  : editingId
                    ? "Update Deal"
                    : "Save Deal"}
              </button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  );
}
