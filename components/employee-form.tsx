"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import type { Id } from "@/src/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const users = useQuery(api.employees.listUsers);
  const createEmployee = useMutation(api.employees.create);

  const [userId, setUserId] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [startDate, setStartDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please select a user");
      return;
    }
    if (!department.trim()) {
      toast.error("Please enter a department");
      return;
    }

    setIsLoading(true);
    try {
      await createEmployee({
        userId: userId as Id<"users">,
        department: department.trim(),
        role,
        startDate: startDate || undefined,
      });
      toast.success("Employee profile created");

      // Reset form
      setUserId("");
      setDepartment("");
      setRole("employee");
      setStartDate("");
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create employee";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* User selection */}
      <div className="space-y-1.5">
        <Label htmlFor="user-select" className="text-xs font-medium">
          User
        </Label>
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger id="user-select" className="h-9 text-sm">
            <SelectValue placeholder="Select a user…" />
          </SelectTrigger>
          <SelectContent>
            {users === undefined ? (
              <SelectItem value="__loading__" disabled>
                Loading users…
              </SelectItem>
            ) : users.length === 0 ? (
              <SelectItem value="__empty__" disabled>
                No users found
              </SelectItem>
            ) : (
              users.map((u) => (
                <SelectItem key={u._id} value={u._id}>
                  {/* users table may have name/email depending on auth provider */}
                  {(u as { name?: string }).name ??
                    (u as { email?: string }).email ??
                    u._id}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Department */}
      <div className="space-y-1.5">
        <Label htmlFor="department" className="text-xs font-medium">
          Department
        </Label>
        <Input
          id="department"
          placeholder="e.g. Engineering"
          className="h-9 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <Label htmlFor="role-select" className="text-xs font-medium">
          Role
        </Label>
        <Select
          value={role}
          onValueChange={(val) => setRole(val as "admin" | "employee")}
        >
          <SelectTrigger id="role-select" className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Start date (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="start-date" className="text-xs font-medium">
          Start Date{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="start-date"
          type="date"
          className="h-9 text-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        size="sm"
        className="w-full h-9 text-xs font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-3.5 mr-1.5 animate-spin" />
        ) : (
          <UserPlus className="size-3.5 mr-1.5" />
        )}
        {isLoading ? "Creating…" : "Create Employee Profile"}
      </Button>
    </form>
  );
}
