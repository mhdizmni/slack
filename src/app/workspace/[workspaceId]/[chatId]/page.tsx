"use client"

import { useGetUserInfo } from "@/features/users/api/use-get-user-info";
import { useChatId } from "@/hooks/use-chat-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";

import { Dots } from "@/components/loaders/dots";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelHeader } from "./channel-header";
import { UserHeader } from "./user-header";

const ChatPage = () => {
    const chatId = useChatId();

    const { data: user, isLoading: loadingUser } = useGetUserInfo({ userId: chatId })
    const { data: channel, isLoading: loadingChannel } = useGetChannel({ channelId: chatId })

    if (loadingChannel || loadingUser) {
        return (
            <div className="h-full flex flex-col gap-3">
                <Skeleton className="h-16 rounded-none" />
                <div className="flex-1 flex flex-col justify-end gap-2 overflow-hidden px-4">
                    <Skeleton className="h-9 w-1/2" />
                    <Skeleton className="h-9 w-1/4" />
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9 w-1/4" />
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9 w-2/3" />
                </div>
                <div className="p-4 pt-0">
                <Skeleton className="h-36" />
                </div>
            </div>
        )
    }

    if (!user && !channel) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-1 text-muted-foreground text-xs font-bold">
                <AlertTriangle className="size-4 animate-pulse text-[#3f0e40]" />
                <p>Chat not found</p>
            </div>
        )
    }

    return (
        <div className="h-full flex">
            {user && (
                <UserHeader user={user} />
            )}
            {channel && (
                <ChannelHeader channel={channel} />
            )}
        </div>
    );
}
 
export default ChatPage;