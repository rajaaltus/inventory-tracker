"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Edit2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/src/convex/_generated/dataModel";

export function EmployeeList() {
  const employees = useQuery(api.employees.list);
  const updateEmployee = useMutation(api.employees.update);

  const [editingId, setEditingId] = useState<Id<"employees"> | null>(null);
  const [editDept, setEditDept] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "employee">("employee");
  const [isUpdating, setIsUpdating] = useState(false);

  // loading state
  if (employees === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const handleEditClick = (emp: any) => {
    setEditingId(emp._id);
    setEditDept(emp.department);
    setEditRole(emp.role);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setIsUpdating(true);
    try {
      await updateEmployee({
        id: editingId,
        department: editDept,
        role: editRole,
      });
      toast.success("Employee updated");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update employee");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Assets</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{emp.name}</span>
                      <span className="text-xs text-muted-foreground">{emp.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>
                    <Badge variant={emp.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{emp.assetCount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(emp)}>
                      <Edit2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
               Update department and role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                placeholder="Engineering, HR, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={editRole} onValueChange={(v: "admin" | "employee") => setEditRole(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating && <Loader2 className="size-4 mr-2 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
