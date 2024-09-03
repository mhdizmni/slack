import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return await ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .unique();
}

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("users")),
        parentMessageId: v.optional(v.id("messages")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await getMember(ctx, args.workspaceId, userId);

        if (!member) {
            throw new Error("Unauthorized");
        }

        let _conversationId;

        if (args.conversationId) {
            const memberTwo = await getMember(ctx, args.workspaceId, args.conversationId); 
            if (!memberTwo) {
                throw new Error("Conversation not found");
            }

            const conversation = await ctx.db.query("conversations")
            .withIndex("by_workspace_id_member_one_id_id_member_two_id", (q) => 
                q.eq("workspaceId", args.workspaceId)
                    .eq("memberOneId", member._id)
                    .eq("memberTwoId", memberTwo?._id)
            )
            .unique();

            
            if (!conversation) {
                const newConversation = await ctx.db.insert("conversations", {
                    workspaceId: args.workspaceId,
                    memberOneId: member._id,
                    memberTwoId: memberTwo._id,
                })
                
                _conversationId = newConversation
            } else {
                _conversationId = conversation?._id;
            }
        }

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);
            if (!parentMessage) {
                throw new Error("Parent message not found");
            }
            _conversationId = parentMessage.conversationId;
        }

        const message = await ctx.db.insert("messages", {
            body: args.body,
            image: args.image,
            memberId: member._id,
            workspaceId: args.workspaceId,
            channelId: args.channelId,
            conversationId: _conversationId,
            // parentMessageId: args.parentMessageId,
            updatedAt: Date.now()
        })

        return message;
    }
})