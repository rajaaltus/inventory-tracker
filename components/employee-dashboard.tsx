"use client";

import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AssetTable } from "@/components/asset-table";

export function EmployeeDashboard() {
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

      <StatsCards />

      <div className="mt-8">
        <AssetTable />
      </div>
    </div>
  );
}

function StatsCards() {
  const stats = [
    {
      label: "My Total Assets",
      value: "—",
      icon: Package,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <Card key={s.label} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">
                {s.label}
              </span>
              <s.icon className="size-4 text-muted-foreground/60" strokeWidth={1.8} />
            </div>
            <p className="font-heading text-2xl font-bold tracking-tight">
              {s.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

