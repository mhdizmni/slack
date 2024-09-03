import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { useCreateMessage } from "@/features/messages/api/use-create-message"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useChatId } from "@/hooks/use-chat-id"

import Quill from "quill"
import { Id } from "../../../../../convex/_generated/dataModel"

import { toast } from "sonner"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"

const Editor = dynamic(() => import("@/components/editor").then((mod) => mod.default), {
    ssr: false,
})

interface ChatInput {
    placeholder: string,
    type: "channel" | "conversation"
}

type MessageValues = {
    body: string, 
    image?: Id<"_storage">, 
    workspaceId: Id<"workspaces">, 
    channelId?: Id<"channels">, 
    parentMessageId?: Id<"messages">,
    conversationId?: Id<"users">
}
export const ChatInput = ({
    placeholder,
    type
}: ChatInput) => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [message, setMessage] = useState<number>(0);

    const editorRef = useRef<Quill | null>(null);

    const workspaceId = useWorkspaceId();
    const chatId = useChatId();

    const { mutate: generateUploadUrl } = useGenerateUploadUrl();
    const { mutate: createMessage } = useCreateMessage();
    const handleSubmit = async ({
        body, image
    }:{
        body: string,
        image: File | null
    }) => {
        const values: MessageValues = {
            body,
            image: undefined,
            workspaceId,
            channelId: undefined,
            conversationId: undefined
        }

        if (type === "channel") {
            values.channelId = chatId as Id<"channels">
        } else if (type === "conversation") {
            values.conversationId = chatId as Id<"users">
        }
        try {
            setIsPending(true);
            editorRef.current?.enable(false);
            if (image) {
                const url = await generateUploadUrl({}, { throwError: true });
    
                if (!url) {
                    throw new Error("Failed to generate upload url");
                }
    
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type,
                    },
                    body: image,
                });
    
                if (!response.ok) {
                    throw new Error("Failed to upload image");
                }
    
                const { storageId } = await response.json();

                values.image = storageId;
            }
            createMessage(values, { throwError: true })
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            editorRef.current?.enable(true);
        }

        setMessage((prev) => prev + 1);
    }

    return (
        <div className="px-4 py-1">
            <Editor
                key={message}
                onSubmit={handleSubmit}
                onCancel={() => { }}
                disabled={isPending}
                innerRef={editorRef}
                placeholder={placeholder}
            />
        </div>
    )
}