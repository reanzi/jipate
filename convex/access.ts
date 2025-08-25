// import { v } from "convex/values";
// import { internalMutation, mutation, query } from "./_generated/server";

import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

// // Function to generate a random access code
// // export function generateAccessCode(): string {
// //     return Math.random().toString(36).substring(2, 8).toUpperCase();
// // }
// export const generateAccessCode = (length: number = 6) => {
//     const code = Array.from({ length }, () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]).join('');
//     return code
// }

// export const initializeSystem = internalMutation({
//     args: { name: v.string(), region: v.string() },
//     handler: async (ctx, { name, region }) => {
//         const exit = await ctx.db.query('facilities').withIndex('by_name_region', q => q.eq('name', name).eq('region', region)).unique();

//         if (exit) return
//         const joinCode = generateAccessCode()
//         await ctx.db.insert('facilities', { name: name.toLowerCase().trim(), region: region.toLowerCase().trim(), joinCode });
//     }
// })
// export const regenerateAccessCode = mutation({
//     args: { name: v.string(), oldCode: v.string() },
//     handler: async (ctx, args) => {
//         const exit = (await ctx.db.query('facilities').withIndex('by_join_code', q => q.eq("joinCode", args.oldCode)).collect()).find(el => el.name === args.name.toLowerCase().trim());

//         if (!exit) return
//         const joinCode = generateAccessCode();
//         await ctx.db.patch(exit._id, { joinCode })
//     }
// })

// export const verifyAccess = mutation({
//     args: { name: v.string(), code: v.string() },
//     handler: async (ctx, { name, code }) => {
//         const facility = await ctx.db.query('facilities').withIndex("by_join_code", q => q.eq('joinCode', code.toLowerCase())).first();
//         if (!facility || name.toLowerCase() !== facility.name) {
//             return "Invalid name or join code"
//         }
//         return "Congrats. Enjoy responsibly"
//     }
// })

// Function to generate a random access code
export function generateAccessCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const initializeSystem = internalMutation({
    args: {},
    handler: async (ctx) => {
        await ctx.db.insert('accessKeys', { key: generateAccessCode() })
    }
});


export const renewPin = internalMutation({
    args: {},
    handler: async (ctx) => {
        const oldKey = await ctx.db.query('accessKeys').first();

        if (!oldKey) {
            await ctx.db.insert('accessKeys', { key: generateAccessCode() });
            return true
        }
        await ctx.db.patch(oldKey._id, { key: generateAccessCode() })
        return true
    }
})

export const checkPin = mutation({
    args: { pin: v.string() },
    handler: async (ctx, { pin }) => {
        const key = (await ctx.db.query('accessKeys').first())?.key;
        if (!key) return false;
        return key.toUpperCase() === pin.toUpperCase()
    }
});