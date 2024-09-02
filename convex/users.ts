import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const current = query({
    args: {},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return null;
        }
        return await ctx.db.get(userId);
    },
});

export const getInfoById = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const user = await ctx.db.get(args.userId as Id<"users">);

        if (!user) {
            return null;
        }

        const currentMember = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        if (currentMember.length === 0) {
            return null;
        }

        const requestedMember = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", currentMember[0].workspaceId).eq("userId", user._id))
            .collect();


        if (requestedMember.length === 0) {
            return null;
        }

        return {
            name: user.name,
            email: user.email,
            image: user.image,
        };
    },
});