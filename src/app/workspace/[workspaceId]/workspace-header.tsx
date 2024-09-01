import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Doc } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { ChevronDown, DoorOpen, ListFilter, SquarePen } from "lucide-react"
import { Hint } from "@/components/hint"
import { useState } from "react"
import { PreferencesModal } from "./preferences-modal"
import { InviteModal } from "./invite-modal"
import { useConfirm } from "@/hooks/use-confirm"
import { useLeaveWorkspace } from "@/features/workspaces/api/use-leave-workspace"
import { toast } from "sonner"

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">,
    isAdmin: boolean,
}
export const WorkspaceHeader = ({
    workspace,
    isAdmin,
}: WorkspaceHeaderProps) => {
    const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false);
    const [inviteOpen, setInviteOpen] = useState<boolean>(false);

    const { mutate: leaveWorkspace, isPending: leavingWorkspace } = useLeaveWorkspace();

    const handleLeave = async () => {
        const ok = await confirm();

        if (!ok) return;

        leaveWorkspace({ workspaceId: workspace._id }, {
            onSuccess: () => {
                toast.success("Left workspace successfully")
            },
            onError: () => {
                toast.error("Failed to leave workspace")
            }
        })
    }

    const [ConfirmationDialog, confirm] = useConfirm(
        `Are you sure about leaving ${workspace.name.toUpperCase()}?`,
        "All data associated with your account, in this workspace, will be gone.",
        "Leave",
        "Go back"
    );

    return (
        <div className="flex items-center justify-between gap-1">
            <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name} />
            <InviteModal open={inviteOpen} setOpen={setInviteOpen} name={workspace.name} joinCode={workspace.joinCode} />
            <ConfirmationDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="transparent"
                        className="justify-start h-7 p-1 font-bold text-lg truncate uppercase"
                    >
                        <span className="truncate">{workspace.name}</span>
                        <ChevronDown className="size-4 shrink-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" className="w-80 p-0 py-1" alignOffset={-12} sideOffset={10}>
                    <DropdownMenuItem
                        className="cursor-pointer hover:!bg-accent items-center gap-1"
                    >
                        <div className="size-9 rounded-md flex items-center justify-center bg-border">
                            {workspace?.name[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="truncate text-lg font-bold">{workspace.name}</p>
                            <p className="text-xs text-muted-foreground">Active Workspace</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                        <>
                            <DropdownMenuItem
                                className="cursor-pointer gap-1 hover:!bg-accent"
                                onClick={() => setInviteOpen(true)}
                            >
                                Invite people to <span className="uppercase">{workspace.name}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer gap-1 hover:!bg-accent"
                                onClick={() => setPreferencesOpen(true)}
                            >
                                <p className="truncate">Preferences</p>
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuItem
                        className="cursor-pointer gap-1 hover:!bg-destructive hover:!text-white"
                        onClick={handleLeave}
                    >
                        <DoorOpen className="size-4" />
                        <p className="truncate">Leave the workspace</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-1">
                <Hint label="Filter conversations">
                    <Button
                        size="iconSm"
                        variant="transparent"
                    >
                        <ListFilter className="size-4" />
                    </Button>
                </Hint>
                <Hint label="New message">
                    <Button
                        size="iconSm"
                        variant="transparent"
                    >
                        <SquarePen className="size-4" />
                    </Button>
                </Hint>
            </div>
        </div>
    )
}