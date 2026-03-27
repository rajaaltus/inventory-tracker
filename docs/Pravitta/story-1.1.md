# Story 1.1: Create Employee Schema & Auth Helpers

Status: ready-for-dev

## Story

As an **admin**,
I want the system to have employee profiles linked to user accounts with roles,
so that the application can determine who is an admin and who is an employee.

## Acceptance Criteria

1. The `employees` table exists in `src/convex/schema.ts` with fields: `userId` (Id<"users">), `department` (string), `role` (union: "admin" | "employee"), `startDate` (optional string)
2. Index `by_userId` exists on the `employees` table for the `userId` field
3. Index `by_department` exists on the `employees` table for the `department` field
4. `src/convex/helpers/auth.ts` exports `requireAuth(ctx)` that returns `{ userId }` or throws
5. `src/convex/helpers/auth.ts` exports `requireAdmin(ctx)` that returns `{ userId, employeeId }` or throws "Unauthorized: admin role required"
6. `src/convex/helpers/auth.ts` exports `getCurrentEmployee(ctx)` that returns the employee record or null
7. All three helpers use the existing Convex Auth `auth` object from `src/convex/auth.ts`

