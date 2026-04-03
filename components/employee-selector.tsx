"use client";

import { useQuery } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { Id } from "@/src/convex/_generated/dataModel";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface Employee {
  _id: Id<"employees">;
  userId: Id<"users">;
  name: string;
  department: string;
  email?: string;
}

interface EmployeeSelectorProps {
  value?: Id<"users">;
  onValueChange: (value: Id<"users"> | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeUserId?: Id<"users">; // Exclude this user from options (for reassign)
}

export function EmployeeSelector({
  value,
  onValueChange,
  placeholder = "Select an employee...",
  disabled = false,
  excludeUserId,
}: EmployeeSelectorProps) {
  const employees = useQuery(api.employees.list) as Employee[] | undefined;

  // Filter out employees that might not have user data and exclude current assignee
  const validEmployees = employees?.filter(emp => 
    emp.name && 
    emp.name !== "Unknown" && 
    (!excludeUserId || emp.userId !== excludeUserId)
  ) || [];

  return (
    <Combobox value={value || ""} onValueChange={onValueChange}>
      <ComboboxInput
        placeholder={placeholder}
        disabled={disabled}
        showTrigger={true}
        showClear={true}
      />
      <ComboboxContent>
        <ComboboxList>
          {validEmployees.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No employees available
            </div>
          ) : (
            validEmployees.map((employee) => (
              <ComboboxItem key={employee.userId} value={employee.userId}>
                <div className="flex flex-col">
                  <span className="font-medium">{employee.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {employee.department}
                  </span>
                </div>
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
