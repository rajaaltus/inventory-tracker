"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, User, Wrench } from "lucide-react";

interface AssetViewProps {
  asset: {
    _id: string;
    name: string;
    type: "hardware" | "software";
    category: string;
    status: "available" | "assigned" | "maintenance" | "retired";
    serialNumber?: string;
    purchaseDate?: string;
    notes?: string;
    assignedToName?: string;
  };
}

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

export function AssetView({ asset }: AssetViewProps) {
  const config = statusConfig[asset.status] ?? {
    label: asset.status,
    className: "text-gray-500 bg-gray-100 border-gray-200",
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Asset Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{asset.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="capitalize">{asset.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p>{asset.category}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={config.className}>{config.label}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                <p>{asset.serialNumber || <span className="text-muted-foreground">—</span>}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p>{asset.assignedToName || <span className="text-muted-foreground">—</span>}</p>
              </div>
            </div>
          </div>
          {asset.purchaseDate && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" />
                Purchase Date
              </label>
              <p>{asset.purchaseDate}</p>
            </div>
          )}
          {asset.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <p className="text-sm mt-1 whitespace-pre-wrap">{asset.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
