import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChatId } from "@/hooks/use-chat-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { WorkspaceHeader } from "./workspace-header"
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MessageCircle, Plus, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();
    const chatId = useChatId();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

    const [_open, setOpen] = useCreateChannelModal();

    if (memberLoading || workspaceLoading) {
        return (
            <div className="flex flex-col gap-2 h-full">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-7 w-1/2" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="size-7" />
                        <Skeleton className="size-7" />
                    </div>
                </div>
                {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-7" />
                ))}
            </div>
        )
    }

    if (!member || !workspace) {
        return (
            <div className="flex flex-col gap-2 h-full items-center justify-center text-white">
                <AlertCircle className="size-5" />
                <p className="text-xs">Workspace not found.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 h-full text-white">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className="flex flex-col gap-1">
                <SidebarItem
                    id="threads"
                    label="Threads"
                    icon={MessageCircle}
                    variant={chatId === "threads" ? "active" : undefined}
                />
                <SidebarItem
                    id="drafts"
                    label="Drafts & sent"
                    icon={SendHorizontal}
                    variant={chatId === "drafts" ? "active" : undefined}
                />
            </div>
            <WorkspaceSection
                label="Channels"
            >
                {channelsLoading && Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-7" />
                ))}
                {channels?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        id={item._id}
                        label={item.name}
                        variant={chatId === item._id ? "active" : undefined}
                    />
                ))}
                <Button
                    variant="transparent"
                    className="justify-start h-7 gap-2"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="size-4 bg-accent/25 rounded shrink-0" />
                    <span className="text-sm truncate">Add channels</span>
                </Button>
            </WorkspaceSection>
            <WorkspaceSection
                label="Direct messages"
                onNew={() => {}}
                hint="Open a direct message"
            >
                {membersLoading && Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-7" />
                ))}
                {members?.map((item) => (
                    <SidebarItem
                        key={item.user._id}
                        id={item.user._id}
                        label={item.user.name || "User"}
                        name={item.user.name || "User"}
                        image={item.user.image}
                        variant={chatId === item.user._id ? "active" : undefined}
                    />
                ))}
                <Button
                    variant="transparent"
                    className="justify-start h-7 gap-2"
                >
                    <Plus className="size-4 bg-accent/25 rounded shrink-0" />
                    <span className="text-sm truncate">Add coworkers</span>
                </Button>
            </WorkspaceSection>
        </div>
    )
}