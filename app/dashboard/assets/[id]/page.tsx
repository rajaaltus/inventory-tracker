"use client";

import { use, useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { Id } from "@/src/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AssetForm } from "@/components/asset-form";
import { AssetView } from "@/components/asset-view";
import { EmployeeSelector } from "@/components/employee-selector";
import { Package, Trash2, UserPlus, UserMinus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
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
  const employees = useQuery(api.employees.list);
  const removeAsset = useMutation(api.assets.remove);
  const assignAsset = useMutation(api.assets.assign);
  const unassignAsset = useMutation(api.assets.unassign);
  const reassignAsset = useMutation(api.assets.reassign);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasDeleted = useRef(false);
  
  // Assignment state
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<Id<"users"> | undefined>();
  const [selectedReassignEmployeeId, setSelectedReassignEmployeeId] = useState<Id<"users"> | undefined>();
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const [showEmployeeSelector, setShowEmployeeSelector] = useState(false);
  const [showReassignSelector, setShowReassignSelector] = useState(false);

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

  const handleAssign = async () => {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    
    setIsAssigning(true);
    try {
      await assignAsset({ id: assetId, userId: selectedEmployeeId });
      toast.success(`Asset assigned to ${asset?.assignedToName || 'employee'}`);
      setShowEmployeeSelector(false);
      setSelectedEmployeeId(undefined);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign asset");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async () => {
    setIsUnassigning(true);
    try {
      await unassignAsset({ id: assetId });
      toast.success("Asset unassigned");
      setIsUnassignDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unassign asset");
    } finally {
      setIsUnassigning(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedReassignEmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    
    setIsReassigning(true);
    try {
      await reassignAsset({ id: assetId, userId: selectedReassignEmployeeId });
      // Get the new employee name for the toast
      const newEmployee = employees?.find(emp => emp.userId === selectedReassignEmployeeId);
      toast.success(`Asset reassigned to ${newEmployee?.name || 'employee'}`);
      setShowReassignSelector(false);
      setSelectedReassignEmployeeId(undefined);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reassign asset");
    } finally {
      setIsReassigning(false);
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
            {isAdmin ? "Edit Asset" : "Asset Details"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin 
              ? "Update asset details or permanently remove it."
              : "View asset information and assignment details."
            }
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

      {isAdmin ? (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <AssetForm initialValues={asset} onSuccess={() => {}} />
          </CardContent>
        </Card>
      ) : (
        <AssetView asset={asset} />
      )}

      {isAdmin && (
        <Card className="border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5" />
              Asset Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.status === "available" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status: Available</p>
                    <p className="text-sm text-muted-foreground">This asset can be assigned to an employee.</p>
                  </div>
                  <Button
                    onClick={() => setShowEmployeeSelector(!showEmployeeSelector)}
                    variant="outline"
                    size="sm"
                  >
                    <UserPlus className="size-4 mr-2" />
                    Assign
                  </Button>
                </div>
                
                {showEmployeeSelector && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <EmployeeSelector
                      value={selectedEmployeeId}
                      onValueChange={setSelectedEmployeeId}
                      placeholder="Select an employee to assign this asset to..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAssign}
                        disabled={!selectedEmployeeId || isAssigning}
                        size="sm"
                      >
                        {isAssigning ? "Assigning..." : "Confirm Assignment"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowEmployeeSelector(false);
                          setSelectedEmployeeId(undefined);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : asset.status === "assigned" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status: Assigned</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned to: <span className="font-medium">{asset.assignedToName}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowReassignSelector(!showReassignSelector)}
                      variant="outline"
                      size="sm"
                    >
                      <Users className="size-4 mr-2" />
                      Reassign
                    </Button>
                    <Button
                      onClick={() => setIsUnassignDialogOpen(true)}
                      variant="outline"
                      size="sm"
                    >
                      <UserMinus className="size-4 mr-2" />
                      Unassign
                    </Button>
                  </div>
                </div>
                
                {showReassignSelector && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <EmployeeSelector
                      value={selectedReassignEmployeeId}
                      onValueChange={setSelectedReassignEmployeeId}
                      placeholder="Select a new employee to reassign this asset to..."
                      excludeUserId={asset.assignedTo}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleReassign}
                        disabled={!selectedReassignEmployeeId || isReassigning}
                        size="sm"
                      >
                        {isReassigning ? "Reassigning..." : "Confirm Reassignment"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowReassignSelector(false);
                          setSelectedReassignEmployeeId(undefined);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Badge variant="secondary">{asset.status}</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {asset.status === "maintenance" && "Asset is currently under maintenance."}
                  {asset.status === "retired" && "Asset has been retired and is no longer in use."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unassign Asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unassign the asset <strong>{asset.name}</strong> from {asset.assignedToName} and set its status back to "available".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnassigning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleUnassign();
              }}
              disabled={isUnassigning}
            >
              {isUnassigning ? "Unassigning..." : "Unassign Asset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
