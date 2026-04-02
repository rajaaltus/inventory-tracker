import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin, getCurrentEmployee } from "./helpers/auth";

/**
 * List assets.
 * - Admin: returns ALL assets with joined employee name.
 * - Employee: returns only assets assigned to them.
 */
export const list = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const { userId } = await requireAuth(ctx);
    const employee = await getCurrentEmployee(ctx);

    let assets;
    if (employee?.role === "admin") {
      assets = await ctx.db.query("assets").collect();
    } else {
      // Employee: only their assigned assets (NFR9)
      assets = await ctx.db
        .query("assets")
        .withIndex("by_assignedTo", (q) => q.eq("assignedTo", userId))
        .collect();
    }

    // Join with users table to resolve assignedTo into a display name
    return Promise.all(
      assets.map(async (asset) => {
        let assignedToName: string | null = null;
        if (asset.assignedTo) {
          const user = await ctx.db.get(asset.assignedTo);
          assignedToName = user?.name ?? user?.email ?? "Unknown";
        }
        return { ...asset, assignedToName };
      })
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
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("hardware"), v.literal("software"))),
    category: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    purchaseDate: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("available"),
        v.literal("assigned"),
        v.literal("maintenance"),
        v.literal("retired")
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Asset not found");
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(args.id, cleanUpdates);
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

    // Scope check for employees
    const employee = await getCurrentEmployee(ctx);
    if (employee?.role !== "admin" && asset.assignedTo !== userId) {
      throw new Error("Unauthorized: you can only view your own assets");
    }

    let assignedToName: string | null = null;
    if (asset.assignedTo) {
      const user = await ctx.db.get(asset.assignedTo);
      assignedToName = user?.name ?? user?.email ?? "Unknown";
    }
    return { ...asset, assignedToName };
  },
});
