"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/src/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

// ─── Status badge colour mapping ─────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  available: {
    label: "Available",
    className:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
  },
  assigned: {
    label: "Assigned",
    className:
      "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
  },
  maintenance: {
    label: "Maintenance",
    className:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
  },
  retired: {
    label: "Retired",
    className:
      "text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "text-gray-500 bg-gray-100 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function TableRowSkeleton() {
  return (
    <TableRow>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyAssets() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 px-6 text-center">
      <div className="size-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
        <Package className="size-5 text-primary" strokeWidth={1.8} />
      </div>
      <h3 className="font-heading text-sm font-semibold mb-1">No assets yet</h3>
      <p className="text-muted-foreground text-xs max-w-xs mx-auto">
        Assets that are added to the system will appear here.
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AssetTable() {
  const router = useRouter();
  const assets = useQuery(api.assets.list);

  // Skeleton while loading
  if (assets === undefined) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Category</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRowSkeleton key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state
  if (assets.length === 0) {
    return <EmptyAssets />;
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Assigned To
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow
              key={asset._id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/assets/${asset._id}`)}
            >
              <TableCell className="font-medium text-sm">{asset.name}</TableCell>
              <TableCell>
                <span className="capitalize text-sm text-muted-foreground">
                  {asset.type}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {asset.category}
              </TableCell>
              <TableCell>
                <StatusBadge status={asset.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {asset.assignedToName ?? (
                  <span className="italic text-muted-foreground/60">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
