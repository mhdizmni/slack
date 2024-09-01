"use client"

import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter, useSearchParams } from "next/navigation";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";

import VerificationInput from "react-verification-input";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Dots } from "@/components/loaders/dots";
import { AlertCircle } from "lucide-react";

const JoinPage = () => {
    const workspaceId = useWorkspaceId();

    const router = useRouter();

    const searchParams = useSearchParams();
    const code = searchParams.get("jc");

    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

    const { mutate, isPending } = useJoinWorkspace();

    const handleJoin = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: () => {
                toast.success("Joined workspace successfully")
                router.replace(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("Failed to join the workspace")
            }
        });
    }

    return (
        <main className="flex h-full flex-col items-center justify-center p-2 bg-background gap-2">
            {data?.isMember && (
                <div className="flex items-center justify-center bg-yellow-100 text-yellow-900 text-xs font-bold p-2 gap-2 absolute top-0 w-full">
                    <AlertCircle className="size-4" />
                    You have already joined this workspace.
                    <Button
                        asChild
                        variant="link"
                        className="h-fit p-0 text-xs"
                    >
                        <Link href="/">
                            Go back to home page
                        </Link>
                    </Button>
                </div>
            )}
            <Image
                src="/logo.svg"
                alt="Slack"
                height={28}
                width={110}
                className="mb-2"
            />
            <p className="font-black text-xl">Join <span className="uppercase">{data?.name}</span></p>
            <div className="min-h-24 flex flex-col items-center gap-2">
                {(isLoading || isPending) ? (
                    <Dots />
                ) : (
                    <>
                        {code && (
                            <div className="flex items-center gap-2 text-xs font-mono border border-dashed p-3 bg-accent rounded w-fit">
                                <span>Join code:</span>
                                <span className="uppercase font-bold">{code}</span>
                            </div>
                        )}
                        <VerificationInput
                            autoFocus
                            length={6}
                            onComplete={handleJoin}
                            classNames={{
                                container: "gap-1",
                                character: "uppercase font-mono font-bold rounded-md w-full aspect-square flex items-center justify-center border-primary",
                                characterInactive: "border-accent bg-accent",
                                characterSelected: "text-primary border-sky-500 animate-pulse shadow-md outline-none",
                            }}
                        />
                    </>
                )}
            </div>
            <Button
                asChild
                variant="outline"
                className="h-7 mt-4 text-xs"
            >
                <Link href="/">
                    Back to home page
                </Link>
            </Button>
        </main>
    );
}

export default JoinPage;