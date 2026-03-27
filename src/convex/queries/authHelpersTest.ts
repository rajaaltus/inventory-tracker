import { query } from "../_generated/server";
import { getCurrentEmployee, requireAdmin, requireAuth } from "../helpers/auth";

// This query exists to ensure the auth helper module type-checks and Convex can compile it.
// It isn't intended for production use.
export const authHelpersTest = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx);
    const employee = await getCurrentEmployee(ctx);

    // We only want to ensure `requireAdmin` type-checks; runtime will likely throw for non-admin users.
    try {
      await requireAdmin(ctx);
    } catch {
      // intentionally ignored
    }

    return {
      userId,
      hasEmployeeRecord: employee !== null,
    };
  },
});

