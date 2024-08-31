import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmProps = {
    title?: React.ReactNode,
    message?: React.ReactNode,
    proceed?: React.ReactNode,
    cancel?: React.ReactNode,
    urge?: boolean,
}

export const useConfirm = (
    title: React.ReactNode,
    message: React.ReactNode,
    proceed: React.ReactNode,
    cancel: React.ReactNode,
    urge: boolean = false,
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    })

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const ConfirmationDialog = () => (
        <Dialog open={promise !==null} onOpenChange={(open) => open === false && handleCancel()}>
            <DialogContent className="md:max-w-md gap-6">
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    {message && (
                        <DialogDescription>
                            {message}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <DialogFooter
                    className="flex-row *:flex-1 gap-2"
                >
                    <Button
                        variant={urge ? "ghost" : "default"}
                        onClick={handleCancel}
                    >
                        {cancel}
                    </Button>
                    <Button
                        variant={!urge ? "ghost" : "default"}
                        className={cn(
                            !urge && "!text-red-700 hover:bg-red-100"
                        )}
                        onClick={handleConfirm}
                    >
                        {proceed}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [ConfirmationDialog, confirm]
}