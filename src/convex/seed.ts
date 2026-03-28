import { mutation } from "./_generated/server";

export const makeAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    // Grab the first user from the users table
    const users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      return "No users found! Please sign up in the browser first.";
    }
    
    // We assume the first user is the one they just created
    const user = users[0];
    
    // Check if an employee record already exists
    const existingEmployee = await ctx.db
      .query("employees")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
      
    if (!existingEmployee) {
      await ctx.db.insert("employees", {
        userId: user._id,
        department: "Engineering",
        role: "admin",
      });
      return `Success: Created an admin profile for user ${user.email || user.name || user._id}`;
    } else {
      await ctx.db.patch(existingEmployee._id, { role: "admin" });
      return `Success: Upgraded existing profile to admin for user ${user.email || user.name || user._id}`;
    }
  },
});

export const debugState = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const employees = await ctx.db.query("employees").collect();
    return {
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email })),
      employees: employees.map(e => ({ userId: e.userId, role: e.role, dept: e.department }))
    };
  },
});

export const makeAllAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let count = 0;
    for (const user of users) {
      const existingEmployee = await ctx.db
        .query("employees")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();
      
      if (!existingEmployee) {
        await ctx.db.insert("employees", {
          userId: user._id,
          department: "Engineering",
          role: "admin",
        });
        count++;
      } else if (existingEmployee.role !== "admin") {
        await ctx.db.patch(existingEmployee._id, { role: "admin" });
        count++;
      }
    }
    return `Success: Promoted/Created ${count} admin profiles.`;
  },
});


