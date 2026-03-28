"use client";

import { UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function NoProfileMessage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <UserX className="size-8 text-muted-foreground" />
      </div>
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-2">
        Profile not set up
      </h1>
      <p className="text-muted-foreground max-w-sm mx-auto mb-8">
        You are authenticated but do not have an employee profile in the system yet.
        Please contact your administrator to get your profile created.
      </p>
    </div>
  );
}
