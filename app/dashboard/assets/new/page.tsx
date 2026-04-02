"use client";

import { AssetForm } from "@/components/asset-form";
import { PackagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NewAssetPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center">
          <PackagePlus className="mr-3 size-6 text-primary" />
          Register New Asset
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add new hardware or software equipment into the central tracking system.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <AssetForm />
        </CardContent>
      </Card>
    </div>
  );
}
