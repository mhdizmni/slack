import { Doc } from "../../../../../convex/_generated/dataModel";
import { Dots } from "@/components/loaders/dots";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { ChevronDown, Hash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ChannelHeaderProps {
    channel: Doc<"channels">
}

export const ChannelHeader = ({
    channel
}: ChannelHeaderProps) => {
    const [value, setValue] = useState<string>(channel.name);
    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);

    const workspaceId = useWorkspaceId();
    const router = useRouter()

    const { data: member } = useCurrentMember({ workspaceId: channel.workspaceId });

    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();

    const handleEditOpen = (open: boolean) => {
        if (member?.role !== "admin") return;

        setEditOpen(open)
    }
    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure you want to delete this channel?",
        "This action cannot be undone.",
        "Proceed",
        "Cancel"
    );

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeChannel({
            id: channel._id,
        }, {
            onSuccess: () => {
                toast.success("Channel deleted successfully")
                router.replace(`/workspace/${workspaceId}`)
            },
            onError: () => toast.error("Failed to delete channel")
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (member?.role !== "admin") return;

        updateChannel({
            id: channel._id,
            name: value
        }, {
            onSuccess: () => {
                setEditOpen(false);
                toast.success("Channel updated successfully")
            },
            onError: () => toast.error("Failed to update channel")
        })
    }

    return (
        <div className="flex items-start justify-between gap-1 p-4 h-16 border-b">
            <ConfirmationDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="justify-start h-7 p-1 font-bold text-lg truncate"
                    >
                        <div className="flex items-center gap-1">
                            <Hash className="size-5 shrink-0" />
                            <span className="truncate">{channel.name}</span>
                        </div>
                        <ChevronDown className="size-4 shrink-0" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 pb-2 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 bg-white border-b">
                        <DialogTitle className="font-medium">
                            <div className="flex items-center gap-1">
                                <Hash className="size-3 shrink-0" />
                                <span className="truncate">{channel.name}</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mx-2 flex flex-col gap-2">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="group flex items-center justify-between bg-white cursor-pointer rounded-md p-2 hover:shadow-md transition-all">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-muted-foreground">Channel name</p>
                                        <div className="flex items-center gap-1">
                                            <Hash className="size-3 shrink-0" />
                                            <span className="truncate text-xl font-bold">{channel.name}</span>
                                        </div>
                                    </div>
                                    {member?.role === "admin" && (
                                        <p className="text-blue-600 text-xs group-hover:underline">Edit</p>
                                    )}
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit channel</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                    <div className="flex items-center ring-ring border rounded-md focus-within:ring-2 focus-within:ring-offset-2">
                                        <Hash className="size-5" />
                                        <Input
                                            placeholder="Channel Name e.g. 'rooftop'"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            minLength={3}
                                            disabled={isUpdatingChannel}
                                            className="border-none !ring-0 !ring-offset-0 p-1"
                                        />
                                    </div>
                                    <div className="flex justify-end w-full">
                                        <Button
                                            type="submit"
                                            className="w-1/3 h-8"
                                            disabled={isUpdatingChannel || value.length < 3}
                                        >
                                            {isUpdatingChannel ? <Dots /> : "Update"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {member?.role === "admin" && (
                            <Button
                                type="button"
                                variant="destructive"
                                className={cn(
                                    "text-xs justify-start gap-1 px-2 py-1 h-7",
                                    isRemovingChannel && "justify-center"
                                )}
                                onClick={handleRemove}
                                disabled={isRemovingChannel}
                            >
                                {isRemovingChannel ? <Dots /> : (
                                    <>
                                        <Trash2 className="size-4" />
                                        Delete Channel
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}