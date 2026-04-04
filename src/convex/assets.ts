import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin, getCurrentEmployee } from "./helpers/auth";
import type { Id } from "./_generated/dataModel";

async function joinAssignedName(ctx: QueryCtx, assignedTo?: Id<"users">) {
  if (!assignedTo) return null;
  const user = await ctx.db.get(assignedTo);
  return user?.name ?? user?.email ?? "Unknown";
}

/**
 * List assets (paginated).
 * - Admin: returns ALL assets with joined employee name.
 * - Employee: returns only assets assigned to them.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx);
    const employee = await getCurrentEmployee(ctx);

    let assets;
    if (employee?.role === "admin") {
      assets = await ctx.db.query("assets").collect();
    } else {
      assets = await ctx.db
        .query("assets")
        .withIndex("by_assignedTo", (q) => q.eq("assignedTo", userId))
        .collect();
    }

    return Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        assignedToName: await joinAssignedName(ctx, asset.assignedTo),
      }))
    );
  },
});

/**
 * Create a new asset.
 * - Admin only
 */
export const create = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("hardware"), v.literal("software")),
    category: v.string(),
    status: v.optional(
      v.union(
        v.literal("available"),
        v.literal("assigned"),
        v.literal("maintenance"),
        v.literal("retired")
      )
    ),
    serialNumber: v.optional(v.string()),
    purchaseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.insert("assets", {
      name: args.name,
      type: args.type,
      category: args.category,
      status: args.status ?? "available",
      serialNumber: args.serialNumber,
      purchaseDate: args.purchaseDate,
      notes: args.notes,
    });
  },
});

/**
 * Update an existing asset.
 * - Admin only
 */
export const update = mutation({
  args: {
    id: v.id("assets"),
    name: v.string(),
    type: v.union(v.literal("hardware"), v.literal("software")),
    category: v.string(),
    serialNumber: v.optional(v.string()),
    purchaseDate: v.optional(v.string()),
    status: v.union(
      v.literal("available"),
      v.literal("assigned"),
      v.literal("maintenance"),
      v.literal("retired")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Asset not found");

    await ctx.db.patch(args.id, {
      name: args.name,
      type: args.type,
      category: args.category,
      status: args.status,
      serialNumber: args.serialNumber,
      purchaseDate: args.purchaseDate,
      notes: args.notes,
    });
  },
});

/**
 * Remove an existing asset completely.
 * - Admin only
 */
export const remove = mutation({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Asset not found");
    await ctx.db.delete(args.id);
  },
});

/**
 * Assign an asset to a user.
 * - Admin only
 */
export const assign = mutation({
  args: {
    id: v.id("assets"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const asset = await ctx.db.get(args.id);
    if (!asset) throw new Error("Asset not found");
    if (asset.status !== "available" && asset.assignedTo) {
      throw new Error("Asset is already assigned to someone else");
    }
    if (!args.userId) {
      throw new Error("Please select an employee to assign this asset to");
    }
    await ctx.db.patch(args.id, {
      assignedTo: args.userId,
      status: "assigned",
    });
  },
});

/**
 * Reassign an asset to a different user.
 * - Admin only
 */
export const reassign = mutation({
  args: {
    id: v.id("assets"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const asset = await ctx.db.get(args.id);
    if (!asset) throw new Error("Asset not found");
    // Allow reassign from any status, just ensure it's not to same user
    if (asset.assignedTo === args.userId) {
      throw new Error("Asset is already assigned to this employee");
    }
    if (!args.userId) {
      throw new Error("Please select an employee to reassign this asset to");
    }
    await ctx.db.patch(args.id, { assignedTo: args.userId });
    // Status stays "assigned" — no intermediate state
  },
});

/**
 * Unassign an asset from a user.
 * - Admin only
 */
export const unassign = mutation({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const asset = await ctx.db.get(args.id);
    if (!asset) throw new Error("Asset not found");
    if (!asset.assignedTo) throw new Error("Asset is not currently assigned");
    await ctx.db.patch(args.id, {
      assignedTo: undefined,
      status: "available",
    });
  },
});

/**
 * Get a specific asset by ID.
 * - Authenticated users can view their own assets.
 * - Admins can view any asset.
 */
export const getById = query({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx);
    const asset = await ctx.db.get(args.id);
    if (!asset) return null;

    // Scope check: employees can only view assets assigned to them
    const employee = await getCurrentEmployee(ctx);
    if (employee?.role !== "admin" && asset.assignedTo !== undefined && asset.assignedTo !== userId) {
      return null;
    }

    return {
      ...asset,
      assignedToName: await joinAssignedName(ctx, asset.assignedTo),
    };
  },
});
/**
 * Get summary statistics for assets.
 * - Admin only.
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const assets = await ctx.db.query("assets").collect();

    return {
      total: assets.length,
      available: assets.filter((a) => a.status === "available").length,
      assigned: assets.filter((a) => a.status === "assigned").length,
      maintenance: assets.filter((a) => a.status === "maintenance").length,
      retired: assets.filter((a) => a.status === "retired").length,
    };
  },
});
