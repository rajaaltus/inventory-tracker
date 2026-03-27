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
});

export default schema;
