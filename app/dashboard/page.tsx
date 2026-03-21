"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Monitor,
  Laptop,
  KeyRound,
  Users,
  Plus,
  Search,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <DashboardSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <DashboardHeader />
        <StatsCards />
        <AssetTabs />
      </main>
    </div>
  );
}

/* ─── Nav ─── */
function DashboardNav() {
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
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="h-8 w-56 pl-9 text-xs"
            />
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-8"
            onClick={() =>
              void signOut().then(() => router.push("/signin"))
            }
          >
            <LogOut className="size-3.5 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ─── Header ─── */
function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your team&rsquo;s inventory and assignments.
        </p>
      </div>
      <Button size="sm" className="text-xs h-9 px-4 w-fit">
        <Plus className="size-3.5 mr-1.5" />
        Add Asset
      </Button>
    </div>
  );
}

/* ─── Stats Cards ─── */
const stats = [
  {
    label: "Total Assets",
    value: "—",
    icon: Package,
    change: "Start adding assets",
  },
  {
    label: "Assigned",
    value: "—",
    icon: Users,
    change: "No assignments yet",
  },
  {
    label: "Available",
    value: "—",
    icon: Monitor,
    change: "Ready to assign",
  },
  {
    label: "Licenses",
    value: "—",
    icon: KeyRound,
    change: "Software licenses",
  },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Asset Tabs ─── */
function AssetTabs() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all" className="text-xs">
          All Assets
        </TabsTrigger>
        <TabsTrigger value="hardware" className="text-xs">
          Hardware
        </TabsTrigger>
        <TabsTrigger value="software" className="text-xs">
          Software
        </TabsTrigger>
        <TabsTrigger value="employees" className="text-xs">
          Employees
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <EmptyState />
      </TabsContent>
      <TabsContent value="hardware">
        <EmptyState type="hardware" />
      </TabsContent>
      <TabsContent value="software">
        <EmptyState type="software" />
      </TabsContent>
      <TabsContent value="employees">
        <EmptyState type="employees" />
      </TabsContent>
    </Tabs>
  );
}

/* ─── Empty State ─── */
function EmptyState({ type = "assets" }: { type?: string }) {
  const icons: Record<string, typeof Package> = {
    assets: Package,
    hardware: Laptop,
    software: KeyRound,
    employees: Users,
  };
  const Icon = icons[type] ?? Package;

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 px-6 text-center">
      <div className="size-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
        <Icon className="size-5 text-primary" strokeWidth={1.8} />
      </div>
      <h3 className="font-heading text-sm font-semibold mb-1">
        No {type} yet
      </h3>
      <p className="text-muted-foreground text-xs max-w-xs mx-auto mb-5">
        Add your first {type === "employees" ? "team member" : "asset"} to get
        started tracking your inventory.
      </p>
      <Button size="sm" className="text-xs h-8 px-4">
        <Plus className="size-3.5 mr-1.5" />
        Add {type === "employees" ? "Employee" : "Asset"}
      </Button>
    </div>
  );
}

/* ─── Recent Activity (placeholder) ─── */
function RecentActivity() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-sm font-semibold">
            Recent Activity
          </h3>
          <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground">
            View all
            <ArrowUpRight className="size-3 ml-1" />
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  ?
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Activity will appear here once you start managing assets.
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Loading Skeleton ─── */
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
