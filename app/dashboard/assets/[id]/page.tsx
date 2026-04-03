"use client";

import { use, useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { Id } from "@/src/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AssetForm } from "@/components/asset-form";
import { Package, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AssetDetailPage({ params }: PageProps) {
  // Unwrap modern Next Next15 dynamic params
  const { id } = use(params);
  const router = useRouter();

  const assetId = id as Id<"assets">;
  
  const asset = useQuery(api.assets.getById, { id: assetId });
  const employeeRole = useQuery(api.employees.getMyRole);
  const removeAsset = useMutation(api.assets.remove);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasDeleted = useRef(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    hasDeleted.current = true;
    try {
      await removeAsset({ id: assetId });
      toast.success("Asset deleted");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete asset");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (asset === undefined || employeeRole === undefined) {
    return <AssetDetailSkeleton />;
  }

  if (asset === null) {
    if (hasDeleted.current) {
      return <AssetDetailSkeleton />;
    }
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Asset Not Found</h2>
        <p className="text-muted-foreground mb-6">This asset may have been deleted or you do not have permission to view it.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isAdmin = employeeRole?.role === "admin";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[200px]">
                {asset.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center">
            <Package className="mr-3 size-6 text-primary" />
            Edit Asset
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update asset details or permanently remove it.
          </p>
        </div>
        
        {isAdmin && (
          <Button
            variant="destructive"
            size="sm"
            className="text-xs h-9 px-4 w-fit"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="size-3.5 mr-1.5" />
            Delete Asset
          </Button>
        )}
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <AssetForm initialValues={asset} />
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset{" "}
              <strong className="text-foreground">{asset.name}</strong> and remove
              its record completely from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault(); // Keep modal open while deleting payload pushes
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AssetDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Skeleton className="h-5 w-48 mb-6" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
