"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import type { AdminUser, UserRole } from "@/types/user";
import { useUser } from "@clerk/nextjs";

// ── Types ─────────────────────────────────────────────────────────────────────

type PendingAction =
  | { type: "role"; userId: string; newRole: UserRole }
  | { type: "suspend"; userId: string }
  | { type: "unsuspend"; userId: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

function Initials({ name, email }: { name: string | null; email: string }) {
  const text = name ?? email;
  const parts = text.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : text.slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-(--color-gold)/20 flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-(--color-gold) uppercase font-['DM_Sans']">
        {initials.toUpperCase()}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<PendingAction | null>(null);

  const { data, isLoading } = useQuery<{ data: AdminUser[] }>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json() as Promise<{ data: AdminUser[] }>;
    },
  });

  const users = data?.data ?? [];

  const mutation = useMutation({
    mutationFn: async (action: PendingAction) => {
      const res = await fetch(`/api/admin/users/${action.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action.type === "role"
            ? { action: "role", role: action.newRole }
            : { action: action.type },
        ),
      });
      if (!res.ok) throw new Error("Action failed");
      return res.json();
    },
    onSuccess: (_data, action) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (action.type === "role") {
        toast.success("Role updated");
      } else if (action.type === "suspend") {
        toast.success("User suspended");
      } else {
        toast.success("User unsuspended");
      }
    },
    onError: () => {
      toast.error("Action failed. Please try again.");
    },
    onSettled: () => setPending(null),
  });

  const columns: ColumnDef<AdminUser>[] = [
    {
      id: "nameAvatar",
      header: "User",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3">
            <Initials name={u.name} email={u.email} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium whitespace-nowrap">
                  {u.name ?? "—"}
                </span>
                {u.banned && (
                  <Badge variant="coral" size="sm">
                    Suspended
                  </Badge>
                )}
              </div>
              <span className="text-(--color-text-secondary) text-xs font-['DM_Sans']">
                {u.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="font-['JetBrains_Mono'] text-xs text-(--color-white-muted) whitespace-nowrap">
          {getValue<string | null>() ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const r = getValue<UserRole>();
        return (
          <Badge variant={r === "ADMIN" ? "gold" : "ghost"} size="sm">
            {r}
          </Badge>
        );
      },
    },
    {
      accessorKey: "bookingsCount",
      header: "Bookings",
      cell: ({ getValue }) => (
        <span className="block text-center font-['JetBrains_Mono'] text-(--color-gold)">
          {getValue<number>()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ getValue }) => (
        <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
          {formatDate(getValue<string>())}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const u = row.original;
        const isSelf =
          u.email === currentUser?.primaryEmailAddress?.emailAddress;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPending({
                  type: "role",
                  userId: u.id,
                  newRole: u.role === "ADMIN" ? "USER" : "ADMIN",
                })
              }
              className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors whitespace-nowrap"
            >
              {u.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
            </button>
            {!isSelf && (
              <button
                onClick={() =>
                  setPending({
                    type: u.banned ? "unsuspend" : "suspend",
                    userId: u.id,
                  })
                }
                className={`px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border transition-colors whitespace-nowrap ${
                  u.banned
                    ? "border-(--color-teal)/40 text-(--color-teal) hover:bg-(--color-teal)/10"
                    : "border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40"
                }`}
              >
                {u.banned ? "Unsuspend" : "Suspend"}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // ── Confirmation dialog labels ─────────────────────────────────────────────
  const dialogTitle =
    pending?.type === "role"
      ? `${pending.newRole === "ADMIN" ? "Make Admin" : "Remove Admin"}`
      : pending?.type === "suspend"
        ? "Suspend User"
        : "Unsuspend User";

  const dialogBody =
    pending?.type === "role"
      ? `Change this user's role to ${pending.newRole === "ADMIN" ? "Admin" : "User"}?`
      : pending?.type === "suspend"
        ? "This will ban the user from signing in. Continue?"
        : "This will restore the user's access. Continue?";

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Users
        </h1>
      </div>

      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={users} isLoading={isLoading} />
      </div>

      {/* ── Confirmation dialog ── */}
      <Dialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <DialogContent className="bg-(--color-navy-surface) border border-(--color-navy-border) text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-['Cormorant_Garamond'] text-xl text-white">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-(--color-white-muted) font-['DM_Sans'] py-2">
            {dialogBody}
          </p>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setPending(null)}
              className="px-4 py-2 rounded-full border border-(--color-navy-border) text-(--color-text-secondary) text-sm font-['DM_Sans'] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => pending && mutation.mutate(pending)}
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-full bg-(--color-gold) text-(--color-navy) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold-light) transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? "Processing…" : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
