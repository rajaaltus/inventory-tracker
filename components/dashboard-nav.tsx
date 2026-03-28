"use client";

import Link from "next/link";
import { Package, Search, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardNav() {
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
