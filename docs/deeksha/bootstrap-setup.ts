import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers/auth";

export const getBootstrapStatus = query({
  args: {},
  handler: async (ctx) => {
    // Check if any admin exists
    const adminCount = await ctx.db
      .query("employees")
      .withIndex("by_department") // just to query, or we can filter
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    if (adminCount.length > 0) return { needsBootstrap: false };

    // if no admin, return the current user ID so they can bootstrap
    try {
      const { userId } = await requireAuth(ctx);
      return { needsBootstrap: true, userId };
    } catch {
      return { needsBootstrap: true, userId: null };
    }
  },
});

export const bootstrapFirstAdmin = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingAdmins = await ctx.db
      .query("employees")
      .withIndex("by_department")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    if (existingAdmins.length > 0) {
      throw new Error("An admin already exists. Cannot bootstrap again.");
    }

    return await ctx.db.insert("employees", {
      userId: args.userId,
      role: "admin",
      department: "Founders",
      startDate: new Date().toISOString().split("T")[0],
    });
  },
});
