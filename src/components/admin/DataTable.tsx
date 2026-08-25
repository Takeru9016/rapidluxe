"use client";

import {
  type ColumnDef,
  flexRender,
  type RowData,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Database } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";

const features = tableFeatures({});

export type AppTableFeatures = typeof features;

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<AppTableFeatures, TData>[];
  data: TData[];
  isLoading?: boolean;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-(--color-navy-border) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData>) {
  const table = useTable({
    features,
    data,
    columns,
  });

  const colCount = columns.length;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-(--color-navy-border)/30">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-['DM_Sans'] text-xs text-(--color-text-secondary) font-medium whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={colCount} />
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={colCount}>
                <EmptyState
                  icon={Database}
                  title="No data"
                  description="Nothing to show here yet."
                />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-(--color-navy-border) hover:bg-white/5 transition-colors"
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 font-['DM_Sans'] text-sm text-white"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
