"use client";

import Link from "next/link";
import {
  Package,
  Monitor,
  Laptop,
  KeyRound,
  Users,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetTable } from "@/components/asset-table";
import { EmployeeList } from "@/components/employee-list";
import { EmployeeForm } from "@/components/employee-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <DashboardHeader />
      <StatsCards />
      <AssetTabs />
      <RecentActivity />
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your team's inventory and assignments.
        </p>
      </div>
      <Button asChild size="sm" className="text-xs h-9 px-4 w-fit">
        <Link href="/dashboard/assets/new">
          <Plus className="size-3.5 mr-1.5" />
          Add Asset
        </Link>
      </Button>
    </div>
  );
}

function StatsCards() {
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
        <AssetTable />
      </TabsContent>
      <TabsContent value="hardware">
        <EmptyState type="hardware" />
      </TabsContent>
      <TabsContent value="software">
        <EmptyState type="software" />
      </TabsContent>
      <TabsContent value="employees" className="space-y-4">
        <EmployeeList />
        <div className="flex justify-center mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs h-9 px-4">
                <Plus className="size-3.5 mr-1.5" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee profile to assign assets.
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm />
            </DialogContent>
          </Dialog>
        </div>
      </TabsContent>
    </Tabs>
  );
}

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
      <Button asChild size="sm" className="text-xs h-8 px-4">
        <Link href={type === "employees" ? "/dashboard/employees" : "/dashboard/assets/new"}>
          <Plus className="size-3.5 mr-1.5" />
          Add {type === "employees" ? "Employee" : "Asset"}
        </Link>
      </Button>
    </div>
  );
}

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
