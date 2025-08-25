import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,
    accessKeys: defineTable({
        key: v.string(),
    }),
    members: defineTable({
        userId: v.id("users"),
        hasAccess: v.boolean()
    }).index("by_userId", ["userId"])
});
// facilities: defineTable({
//     name: v.string(),
//     region: v.string(),
//     joinCode: v.string()
// }).index('by_name', ['name']).index("by_join_code", ["joinCode"]).index("by_name_region", ["name", "region"]),
// voters: defineTable({
//     region: v.string(),
//     council: v.string(),
//     constituency: v.string(),
//     ward: v.string(),
//     voter_id: v.string(),
//     firstname: v.string(),
//     middlename: v.string(),
//     surname: v.string(),
//     date_of_birth: v.string(),
//     facilityId: v.id('facilities')
// }).index('by_ward', ['ward']),