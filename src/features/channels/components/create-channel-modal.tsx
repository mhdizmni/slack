import React, { useState } from "react";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { usePathname, useRouter } from "next/navigation";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dots } from "@/components/loaders/dots";
import { toast } from "sonner";
import { Hash } from "lucide-react";

export const CreateChannelModal = () => {
    const [open, setOpen] = useCreateChannelModal();

    const workspaceId = useWorkspaceId();

    const router = useRouter();

    const [name, setName] = useState<string>("");
    const { mutate, data, isPending, isError, isSettled, isSuccess } = useCreateChannel();

    const handleClose = () => {
        setOpen(false);
        //todo: reset form
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await mutate({ name, workspaceId }, {
            onSuccess(id) {
                router.push(`/workspace/${workspaceId}/${id}`);
                setOpen(false);
                toast.success("Channel was created successfully!");
                setName("")
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div className="flex items-center ring-ring rounded-md border focus-within:ring-2 focus-within:ring-offset-2">
                        <Hash className="size-5" />
                        <Input
                            placeholder="Channel Name e.g. 'rooftop'"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            minLength={3}
                            disabled={isPending}
                            className="border-none !ring-0 !ring-offset-0 p-1"
                        />
                    </div>
                    <div className="flex justify-end w-full">
                        <Button
                            type="submit"
                            className="w-1/3 h-8"
                            disabled={isPending || name.length < 3}
                        >
                            {isPending ? <Dots /> : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}