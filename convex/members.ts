import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from '@convex-dev/auth/server';
import { internal } from "./_generated/api";


export const hasAccess = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return false;
        const access = await ctx.db.query('members').withIndex("by_userId", q => q.eq('userId', userId)).first();

        return !!access
    }
});



// Internal mutation to create a member (called by auth hook)
export const createMember = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        // Check if member already exists
        const existingMember = await ctx.db
            .query("members")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (!existingMember) {
            await ctx.db.insert("members", {
                userId,
                hasAccess: true, // Default to no access
            });
            await ctx.runMutation(internal.access.renewPin);
            console.log(`Created member for user: ${userId}`);
        }
    },
});

// Query to get current user's member data
export const getCurrentMember = query({
    args: {},
    handler: async (ctx) => {
        const identity = await getAuthUserId(ctx);
        if (!identity) return null;

        return await ctx.db
            .query("members")
            .withIndex("by_userId", (q) => q.eq("userId", identity))
            .first();
    },
});

// Mutation to grant access to a member
export const revokeAccess = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const member = await ctx.db
            .query("members")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (member) {
            await ctx.db.patch(member._id, { hasAccess: true });
        }
    },
});

// Query to list all members (for admin purposes)
export const listMembers = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        return await ctx.db.query("members").collect();
    },
});