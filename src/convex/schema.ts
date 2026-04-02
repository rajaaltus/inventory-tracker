import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  employees: defineTable({
    userId: v.id("users"),
    department: v.string(),
    role: v.union(v.literal("admin"), v.literal("employee")),
    startDate: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_department", ["department"]),
  assets: defineTable({
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
    assignedTo: v.optional(v.id("users")),
    receiptFileId: v.optional(v.id("_storage")),
    photoFileId: v.optional(v.id("_storage")),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_type", ["type"]),
});

export default schema;
