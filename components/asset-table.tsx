"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { api } from "@/src/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, XCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
function TableRowSkeleton({ showSerialNumber = false }: { showSerialNumber?: boolean }) {
  return (
    <TableRow>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
      {showSerialNumber && (
        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      )}
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
interface AssetTableProps {
  typeFilter?: "hardware" | "software";
  assets?: any[]; // Allow passing assets directly (for employee view)
  readonly?: boolean; // Hide admin actions when true
  showSerialNumber?: boolean; // Show serial number column when true
}

export function AssetTable({
  typeFilter,
  assets: passedAssets,
  readonly = false,
  showSerialNumber = false
}: AssetTableProps) {
  const router = useRouter();
  const allAssets = useQuery(api.assets.list);

  // Filter states
  const [internalStatusFilter, setStatusFilter] = useState<string>("all");
  const [internalCategoryFilter, setCategoryFilter] = useState<string>("all");
  const [internalAssignedFilter, setAssignedFilter] = useState<string>("all");
  const [internalTypeFilter, setTypeFilter] = useState<string>(typeFilter || "all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sync internal type filter with prop if it changes
  useMemo(() => {
    if (typeFilter) setTypeFilter(typeFilter);
  }, [typeFilter]);

  // Extract unique values from allAssets for dropdowns
  const { categories, assignees } = useMemo(() => {
    if (!allAssets) return { categories: [], assignees: [] };

    const cats = Array.from(new Set(allAssets.map(a => a.category))).sort();

    // Map with unique IDs for assignees
    const seenIds = new Set();
    const as = allAssets
      .filter(a => {
        if (!a.assignedTo || seenIds.has(a.assignedTo)) return false;
        seenIds.add(a.assignedTo);
        return true;
      })
      .map(a => ({ id: a.assignedTo!, name: a.assignedToName! }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { categories: cats, assignees: as };
  }, [allAssets]);

  const assets = useMemo(() => {
    const baseAssets = passedAssets !== undefined ? passedAssets : allAssets;
    if (!baseAssets) return undefined;

    return baseAssets.filter((asset) => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const nameMatch = asset.name.toLowerCase().includes(term);
        const serialMatch = asset.serialNumber?.toLowerCase().includes(term) ?? false;
        if (!nameMatch && !serialMatch) return false;
      }

      // Type filter
      if (internalTypeFilter !== "all" && asset.type !== internalTypeFilter) return false;

      // Status filter
      if (internalStatusFilter !== "all" && asset.status !== internalStatusFilter) return false;

      // Category filter
      if (internalCategoryFilter !== "all" && asset.category !== internalCategoryFilter) return false;

      // Assigned To filter
      if (internalAssignedFilter === "unassigned") {
        if (asset.assignedTo) return false;
      } else if (internalAssignedFilter !== "all") {
        if (asset.assignedTo !== internalAssignedFilter) return false;
      }

      return true;
    });
  }, [passedAssets, allAssets, internalTypeFilter, internalStatusFilter, internalCategoryFilter, internalAssignedFilter, searchTerm]);

  const hasActiveFilters =
    internalTypeFilter !== (typeFilter || "all") ||
    internalStatusFilter !== "all" ||
    internalCategoryFilter !== "all" ||
    internalAssignedFilter !== "all" ||
    searchTerm !== "";

  const clearFilters = () => {
    setTypeFilter(typeFilter || "all");
    setStatusFilter("all");
    setCategoryFilter("all");
    setAssignedFilter("all");
    setSearchTerm("");
  };

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
              {showSerialNumber && (
                <TableHead className="text-xs font-semibold">Serial Number</TableHead>
              )}
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRowSkeleton key={i} showSerialNumber={showSerialNumber} />
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
    <div className="space-y-4">
      {!readonly && (
        <div className="flex flex-wrap items-center gap-3 p-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          {!typeFilter && (
            <Select value={internalTypeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-[130px] text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Category Filter */}
          <Select value={internalCategoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={internalStatusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  Available
                </div>
              </SelectItem>
              <SelectItem value="assigned">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500" />
                  Assigned
                </div>
              </SelectItem>
              <SelectItem value="maintenance">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-amber-500" />
                  Maintenance
                </div>
              </SelectItem>
              <SelectItem value="retired">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-gray-500" />
                  Retired
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Assigned To Filter */}
          <Select value={internalAssignedFilter} onValueChange={setAssignedFilter}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {assignees.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <XCircle className="size-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden bg-card">
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
              {showSerialNumber && (
                <TableHead className="text-xs font-semibold text-muted-foreground">
                  Serial Number
                </TableHead>
              )}
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
                onClick={() => !readonly && router.push(`/dashboard/assets/${asset._id}`)}
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
                {showSerialNumber && (
                  <TableCell className="text-sm text-muted-foreground">
                    {asset.serialNumber || (
                      <span className="italic text-muted-foreground/60">—</span>
                    )}
                  </TableCell>
                )}
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
    </div>
  );
}
