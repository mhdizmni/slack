import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string
    joinCode: string
}
export const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode
}: InviteModalProps) => {
    const workspaceId = useWorkspaceId();

    const { mutate: newJoinCode, isPending } = useNewJoinCode();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure you want to generate a new join code?",
        "Current join code will be revoked.",
        "Proceed",
        "Cancel",
        true
    );

    const handleCopy = () => {
        const link = `${window.location.origin}/join/${joinCode}`;

        navigator.clipboard.writeText(link)
        .then(() => {
            toast.success("Invite link copied to clipboard");
        })
    }
    const handleGenerate = async () => {
        const ok = await confirm();

        if (!ok) return;

        newJoinCode({
            workspaceId,
        }, {
            onSuccess: () => {
                toast.success("Join code was generated successfully")
            },
            onError: () => toast.error("Failed to generate join code")
        })
    }

    return (
        <>
            <ConfirmationDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 pb-2">
                    <DialogHeader className="p-4">
                        <DialogTitle className="font-bold text-xl">Invite people to <span className="uppercase">{name}</span></DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="text-5xl font-bold font-mono uppercase">
                            {joinCode}
                        </div>
                        <Hint label="Click to copy the link">
                            <Button
                                variant="link"
                                className="gap-1 h-7"
                                onClick={handleCopy}
                            >
                                Copy Invite Link
                                <Copy className="size-3" />
                            </Button>
                        </Hint>
                    </div>
                    <div className="flex justify-start px-2">
                        <Button
                            variant="ghost"
                            className="gap-1 h-7"
                            onClick={handleGenerate}
                        >
                            New invite code
                            <RotateCcw className="size-3" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}