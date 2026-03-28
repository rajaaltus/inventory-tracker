"use client";

import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        <EmptyState />
      </div>
    </div>
  );
}

function StatsCards() {
  const stats = [
    {
      label: "My Total Assets",
      value: "0",
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

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 px-6 text-center">
      <div className="size-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
        <Package className="size-5 text-primary" strokeWidth={1.8} />
      </div>
      <h3 className="font-heading text-sm font-semibold mb-1">
        No assets assigned yet
      </h3>
      <p className="text-muted-foreground text-xs max-w-xs mx-auto">
        When your administrator assigns hardware or software to you, they will appear here.
      </p>
    </div>
  );
}
