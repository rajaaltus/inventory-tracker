import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentEmployee, requireAdmin } from "./helpers/auth";
import { auth } from "./auth";

/**
 * Get the current user's role.
 */
export const getMyRole = query({
  args: {},
  handler: async (ctx) => {
    const employee = await getCurrentEmployee(ctx);
    if (!employee) return null;
    return { role: employee.role };
  },
});

/**
 * Create a new employee profile.
 * Requires the caller to be an admin.
 */
export const create = mutation({
  args: {
    userId: v.id("users"),
    department: v.string(),
    role: v.union(v.literal("admin"), v.literal("employee")),
    startDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    // Check if the user already has an employee profile
    const existing = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      throw new Error("This user already has an employee profile.");
    }

    return await ctx.db.insert("employees", {
      userId: args.userId,
      department: args.department,
      role: args.role,
      startDate: args.startDate,
    });
  },
});

/**
 * List all users from the auth users table.
 * Only admins can query this.
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdmin(ctx);
    } catch (error) {
      return [];
    }
    return await ctx.db.query("users").collect();
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const employees = await ctx.db.query("employees").collect();
    return Promise.all(
      employees.map(async (emp) => {
        const user = await ctx.db.get(emp.userId);
        // Assets table may not exist yet (Epic 2) — handle gracefully
        const assetCount = 0; // Will be updated in Epic 2
        return {
          ...emp,
          name: user?.name ?? user?.email ?? "Unknown",
          email: user?.email,
          assetCount,
        };
      })
    );
  },
});

export const update = mutation({
  args: {
    id: v.id("employees"),
    department: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("employee"))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    // Remove undefined fields
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, val]) => val !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
  },
});
/**
 * One-off mutation to cleanup duplicates and update a specific user's role.
 */
export const cleanupAndUpdateRole = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Cleanup Duplicates
    const allEmployees = await ctx.db.query("employees").collect();
    const seenUserIds = new Set();
    let removedCount = 0;

    for (const emp of allEmployees) {
      if (seenUserIds.has(emp.userId)) {
        await ctx.db.delete(emp._id);
        removedCount++;
      } else {
        seenUserIds.add(emp.userId);
      }
    }

    // 2. Update specific user
    const targetEmail = "deekshashetti96@gmail.com";
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), targetEmail))
      .first();

    let updatedRoleCount = 0;
    if (user) {
      const employee = await ctx.db
        .query("employees")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      if (employee) {
        await ctx.db.patch(employee._id, { role: "employee" });
        updatedRoleCount++;
      }
    }

    return {
      removedDuplicates: removedCount,
      updatedRoleFor: user ? targetEmail : "User not found",
      updatedRoleCount,
    };
  },
});
