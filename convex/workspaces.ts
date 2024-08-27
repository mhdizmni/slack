import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }
        
        const joinCode = "12345";

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode,
            userId,
        });

        return workspaceId;
    },
});

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("workspaces").collect();
    },
});