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
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string
}
export const PreferencesModal = ({
    open,
    setOpen,
    initialValue
}: PreferencesModalProps) => {
    const workspaceId = useWorkspaceId();

    const [value, setValue] = useState<string>(initialValue);
    const [editOpen, setEditOpen] = useState<boolean>(false);

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure you want to delete this workspace?",
        "This action cannot be undone.",
        "Proceed",
        "Cancel"
    );

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeWorkspace({
            id: workspaceId,
        }, {
            onSuccess: () => {
                toast.success("Workspace deleted successfully")
            },
            onError: () => toast.error("Failed to delete workspace")
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateWorkspace({
            id: workspaceId,
            name: value
        }, {
            onSuccess: () => {
                setEditOpen(false);
                toast.success("Workspace updated successfully")
            },
            onError: () => toast.error("Failed to update workspace")
        })
    }

    return (
        <>
            <ConfirmationDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 pb-2 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 bg-white border-b">
                        <DialogTitle className="font-medium">{value}</DialogTitle>
                    </DialogHeader>
                    <div className="mx-2 flex flex-col gap-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="group flex items-center justify-between bg-white cursor-pointer rounded-md p-2 hover:shadow-md transition-all">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-muted-foreground">Workspace name</p>
                                        <p className="text-lg font-bold">{value}</p>
                                    </div>
                                    <p className="text-blue-600 text-xs group-hover:underline">Edit</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit workspace</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                    <Input
                                        placeholder="Workspace Name e.g. 'Work'"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        minLength={3}
                                        disabled={isUpdatingWorkspace}
                                    />
                                    <div className="flex justify-end w-full">
                                        <Button
                                            type="submit"
                                            className="w-1/3 h-8"
                                            disabled={isUpdatingWorkspace || value.length < 3}
                                        >
                                            {isUpdatingWorkspace ? <Dots /> : "Update"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button
                            type="button"
                            variant="destructive"
                            className={cn(
                                "text-xs justify-start gap-1 px-2 py-1 h-7",
                                isRemovingWorkspace && "justify-center"
                            )}
                            onClick={handleRemove}
                            disabled={isRemovingWorkspace}
                        >
                            {isRemovingWorkspace ? <Dots /> : (
                                <>
                                    <Trash2 className="size-4" />
                                    Delete workspace
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}