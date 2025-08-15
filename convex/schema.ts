import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    facilities: defineTable({
        name: v.string(),
        region: v.string()
    }).index('by_name', ['name']),
    voters: defineTable({
        region: v.string(),
        council: v.string(),
        constituency: v.string(),
        ward: v.string(),
        voter_id: v.string(),
        firstname: v.string(),
        middlename: v.string(),
        surname: v.string(),
        date_of_birth: v.string(),
        facilityId: v.id('facilities')
    }).index('by_ward', ['ward']),
});