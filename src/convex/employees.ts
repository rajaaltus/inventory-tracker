import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers/auth";
import { auth } from "./auth";

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
      .unique();
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
