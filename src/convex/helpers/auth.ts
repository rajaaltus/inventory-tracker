import type { QueryCtx, MutationCtx } from "../_generated/server";
import { auth } from "../auth";

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Unauthorized: authentication required");
  return { userId };
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const { userId } = await requireAuth(ctx);
  const employee = await ctx.db
    .query("employees")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  if (!employee || employee.role !== "admin") {
    throw new Error("Unauthorized: admin role required");
  }

  return { userId, employeeId: employee._id };
}

export async function getCurrentEmployee(ctx: QueryCtx | MutationCtx) {
  const { userId } = await requireAuth(ctx);
  return await ctx.db
    .query("employees")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

