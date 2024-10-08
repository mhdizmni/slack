import { Dots } from "@/components/loaders/dots";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwither = () => {
    const router = useRouter();
    const [_open, setOpen] = useCreateWorkspaceModal();

    const workspaceId = useWorkspaceId();

    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

    if (workspaceLoading || workspacesLoading) {
        setOpen(false)
        return (
            <div className="size-9 rounded-lg flex items-center justify-center bg-accent/50">
                <Dots className="size-1 bg-white" />
            </div>
        )
    }

    if (!workspace) {
        router.push("/")
        return;
    }

    const filteredWorkspaces = workspaces?.filter((workspace) => workspace._id !== workspaceId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    className="h-9 w-9 rounded-lg"
                >
                    {workspace?.name[0].toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="w-80 rounded-2xl p-0 py-1" alignOffset={-12} sideOffset={10}>
                <DropdownMenuItem
                    className="flex-col items-start"
                    onClick={() => router.push(`/workspace/${workspace?._id}`)}
                >
                    <p className="font-bold text-lg">{workspace?.name}</p>
                    <p className="text-muted-foreground text-xs">Current Workspace</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {filteredWorkspaces?.map((workspace, i) => (
                    <DropdownMenuItem
                        key={i}
                        className="gap-1"
                        onClick={() => router.push(`/workspace/${workspace._id}`)}
                    >
                        <div className="size-9 rounded-md flex items-center justify-center bg-primary text-primary-foreground">
                            {workspace.name[0].toUpperCase()}
                        </div>
                        <p className="truncate">{workspace.name}</p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                    className="gap-1"
                    onClick={() => setOpen(true)}
                >
                    <div className="size-9 rounded-md flex items-center justify-center bg-border">
                        <Plus />
                    </div>
                    <p className="truncate">Add a Workspace</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}