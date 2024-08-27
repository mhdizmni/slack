import React, { useState } from "react";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useCreateWorkspace } from "../api/use-create-workspace";

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

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal();

    const router = useRouter();

    const [name, setName] = useState<string>("");
    const { mutate, data, isPending, isError, isSettled, isSuccess } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        //todo: reset form
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await mutate({ name }, {
            onSuccess(id) {
                router.push(`/workspace/${id}`);
                setOpen(false);
                toast.success("Workspace was created successfully!")
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <Input
                        placeholder="Workspace Name e.g. 'Work'"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        minLength={3}
                        disabled={isPending}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
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