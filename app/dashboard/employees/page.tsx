"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { Loader2, ShieldCheck, Users, Package, ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeForm } from "@/components/employee-form";
import { EmployeeList } from "@/components/employee-list";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme-toggle";



export default function EmployeesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentEmployee = useQuery(api.employees.current);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || currentEmployee === undefined) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  if (currentEmployee === null || currentEmployee.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md space-y-4">
          <ShieldCheck className="size-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground text-sm">
            You need administrator privileges to view and manage the employee roster.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <PageNav />
        <main className="max-w-3xl mx-auto px-6 py-8">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Users className="size-5 text-primary" strokeWidth={2} />
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Employees
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Create and manage employee profiles linked to user accounts.
            </p>
          </div>

          {/* Employee list card */}
          <Card className="border-border bg-card mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Employee Roster
              </CardTitle>
              <CardDescription className="text-xs">
                Manage your team's access and assignments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeList />
            </CardContent>
          </Card>

          {/* Create employee card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Create Employee Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Assign a role and department to an existing user account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeForm />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Toast provider */}
      <Toaster />
    </>
  );
}

/* ─── Nav ─── */
function PageNav() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <Package className="size-5 text-primary" strokeWidth={2.2} />
          <span className="font-heading text-sm font-semibold tracking-tight">
            AssetTracker
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-8"
            onClick={() => void signOut().then(() => router.push("/signin"))}
          >
            <LogOut className="size-3.5 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ─── Loading Skeleton ─── */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Skeleton className="h-4 w-28 mb-6" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
