import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspaceHeader } from "./workspace-header"
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

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
        <div className="flex flex-col gap-1 h-full text-white">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
        </div>
    )
}