// convex/voters.ts

import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const bulkInsertVoters = action({
    args: {
        facilityId: v.id('facilities'),
        voters: v.array(
            v.object({
                region: v.string(),
                council: v.string(),
                constituency: v.string(),
                ward: v.string(),
                voter_id: v.string(),
                firstname: v.string(),
                middlename: v.string(),
                surname: v.string(),
                date_of_birth: v.string(),
            })
        ),
    },
    handler: async ({ runMutation }, { voters, facilityId }) => {
        // Convex mutations have a size limit, so we'll process in batches.
        const BATCH_SIZE = 1000;
        const totalVoters = voters.length;

        for (let i = 0; i < totalVoters; i += BATCH_SIZE) {
            const batch = voters.slice(i, i + BATCH_SIZE);
            console.log(`Inserting batch ${i / BATCH_SIZE + 1}...`);
            await runMutation(internal.voters.insertBatch, { batch, facilityId });
        }
    },
});

export const insertBatch = internalMutation({
    args: {
        facilityId: v.id('facilities'),
        batch: v.array(
            v.object({
                region: v.string(),
                council: v.string(),
                constituency: v.string(),
                ward: v.string(),
                voter_id: v.string(),
                firstname: v.string(),
                middlename: v.string(),
                surname: v.string(),
                date_of_birth: v.string(),
            })
        ),
    },
    handler: async ({ db }, { batch, facilityId }) => {
        // This is an internal mutation, so it can be called by the action.
        for (const voter of batch) {
            await db.insert("voters", { ...voter, facilityId });
        }
    },
});