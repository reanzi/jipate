import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: { name: v.string(), region: v.string() },
    handler: async ({ db }, args) => {
        const doesExist = await db.query('facilities').withIndex('by_name', q => q.eq('name', args.name)).first();
        if (doesExist) {
            throw new ConvexError('Facility already exist.')
        }
        return await db.insert('facilities', args);
    }
});

export const isInitialized = query({
    args: { name: v.string() },
    handler: async ({ db }, { name }) => {
        try {
            const id = (await db.query('facilities').withIndex('by_name', q => q.eq('name', name)).unique())?._id;
            return id;

        } catch (e) {
            console.log(JSON.stringify(e, null, 2))
            return undefined
        }
    }
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('facilities').collect();
    }
})