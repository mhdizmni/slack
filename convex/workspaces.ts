import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const generateCode = () => {
    const characters = "0123456789abcdefghijklmnopqrstuyxwz";
    const code = Array.from(
        { length: 6 },
        () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    return code;
};

export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.workspaceId, { joinCode: generateCode() })

        return args.workspaceId;
    },
});

export const join = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        joinCode: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const workspace = await ctx.db.get(args.workspaceId);

        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
            .unique();

        if (member) {
            throw new Error("Already joined");
        }

        if (workspace.joinCode !== args.joinCode.toLowerCase()) {
            throw new Error("Invalid join code");
        }

        await ctx.db.insert("members", {
            userId,
            workspaceId: args.workspaceId,
            role: "member",
        })

        return workspace._id;
    },
});

export const leave = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        userId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user_id = args.userId ? args.userId : userId;

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", user_id))
            .unique();

        if (!member) {
            throw new Error("Unauthorized");
        }

        const isAdmin = member?.role === "admin";

        if (args.userId && !isAdmin) {
            throw new Error("Unauthorized");
        }


        const [members] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_user_id", (q) => q.eq("userId", user_id))
                .collect(),
        ]);

        for (const member of members) {
            await ctx.db.delete(member._id);
        }

        return args.workspaceId;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const joinCode = generateCode();

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode,
            userId,
        });

        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin",
        });

        await ctx.db.insert("channels", {
            name: "general",
            workspaceId,
        });

        return workspaceId;
    },
});

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const members = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        const workspaceIds = members.map((member) => member.workspaceId);

        const workspaces = [];

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);
            if (workspace) {
                workspaces.push(workspace);
            }
        }

        return workspaces;
    },
});

export const getInfoById = query({
    args: { id: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
            .unique();

        const workspace = await ctx.db.get(args.id);

        if (!workspace) {
            return null;
        }

        return {
            name: workspace.name,
            isMember: !!member,
        };
    },
});

export const getById = query({
    args: { id: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
            .unique();

        if (!member) {
            return null;
        }

        return await ctx.db.get(args.id);
    },
});

export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
        });

        return args.id;
    },
});

export const remove = mutation({
    args: { id: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const [members] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
                .collect(),
        ]);

        for (const member of members) {
            await ctx.db.delete(member._id);
        }

        await ctx.db.delete(args.id);

        return args.id;
    },
});