"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/src/convex/_generated/api";
import { DashboardNav } from "@/components/dashboard-nav";
import { AdminDashboard } from "@/components/admin-dashboard";
import { EmployeeDashboard } from "@/components/employee-dashboard";
import { NoProfileMessage } from "@/components/no-profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const roleData = useQuery(api.employees.getMyRole);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || roleData === undefined) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) return null;

  // Role-based rendering
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="pb-12">
        {roleData === null ? (
          <NoProfileMessage />
        ) : roleData.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <EmployeeDashboard />
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-80 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
