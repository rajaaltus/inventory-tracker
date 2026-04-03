"use client";

import { useQuery } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { AssetTable } from "@/components/asset-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmployeeDashboard() {
  const assets = useQuery(api.assets.list);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          My Assets
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View all equipment and software assigned to you.
        </p>
      </div>

      <div className="mt-8">
        {assets === undefined ? (
          <EmployeeAssetsSkeleton />
        ) : assets.length === 0 ? (
          <EmployeeEmptyState />
        ) : (
          <AssetTable assets={assets} readonly showSerialNumber />
        )}
      </div>
    </div>
  );
}

function EmployeeEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 px-6 text-center">
      <div className="size-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
        <Package className="size-5 text-primary" strokeWidth={1.8} />
      </div>
      <h3 className="font-heading text-sm font-semibold mb-1">No assets assigned to you</h3>
      <p className="text-muted-foreground text-xs max-w-xs mx-auto">
        Assets that are assigned to you will appear here.
      </p>
    </div>
  );
}

function EmployeeAssetsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

