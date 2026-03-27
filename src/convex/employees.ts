import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers/auth";

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
