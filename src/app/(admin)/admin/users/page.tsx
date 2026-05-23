"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type UserRole = "ADMIN" | "USER";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  joinedAt: string;
  role: UserRole;
  avatarUrl: string;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────

const dummyUsers: AdminUser[] = [
  { id: "u-001", name: "Arjun Sharma", email: "arjun.sharma@email.com", phone: "+91 98765 43210", bookingsCount: 3, joinedAt: "2024-11-15", role: "USER", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { id: "u-002", name: "Priya Mehta", email: "priya.mehta@email.com", phone: "+91 87654 32109", bookingsCount: 2, joinedAt: "2024-12-01", role: "USER", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { id: "u-003", name: "Rahul Verma", email: "rahul.verma@email.com", phone: "+91 76543 21098", bookingsCount: 1, joinedAt: "2025-01-10", role: "USER", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { id: "u-004", name: "Sahil Jadhav", email: "admin@rapidluxe.com", phone: "+91 99999 00001", bookingsCount: 0, joinedAt: "2024-01-01", role: "ADMIN", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  { id: "u-005", name: "Sneha Patel", email: "sneha.patel@email.com", phone: "+91 65432 10987", bookingsCount: 2, joinedAt: "2025-02-14", role: "USER", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
];

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<AdminUser>[] = [
  {
    id: "nameAvatar",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image
            src={row.original.avatarUrl}
            alt={row.original.name}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <span className="text-white font-medium whitespace-nowrap">
          {row.original.name}
        </span>
      </div>
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ getValue }) => (
      <span className="font-['JetBrains_Mono'] text-xs text-(--color-white-muted) whitespace-nowrap">
        {getValue<string>()}
      </span>
    ),
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
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ getValue }) => (
      <span className="text-(--color-text-secondary) text-sm whitespace-nowrap">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue<UserRole>();
      return (
        <Badge variant={role === "ADMIN" ? "gold" : "ghost"} size="sm">
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <a
          href={`/admin/users/${row.original.id}/edit`}
          className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-white hover:border-(--color-gold)/40 transition-colors"
        >
          Edit
        </a>
        <button className="px-2.5 py-1.5 rounded-md text-xs font-['DM_Sans'] border border-(--color-navy-border) text-(--color-white-muted) hover:text-(--color-coral) hover:border-(--color-coral)/40 transition-colors">
          Suspend
        </button>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Users
        </h1>
      </div>

      {/* Table */}
      <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-x-auto">
        <DataTable columns={columns} data={dummyUsers} />
      </div>
    </div>
  );
}
