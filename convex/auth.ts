import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Anonymous],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      // Only create member if this is a new user (not an update)
      if (!existingUserId) {
        await ctx.runMutation(internal.members.createMember, { userId });
      }
    },
  },
});