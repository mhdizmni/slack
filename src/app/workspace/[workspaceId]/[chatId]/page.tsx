"use client"
import { useChatId } from "@/hooks/use-chat-id";

const ChatPage = () => {
    const chatId = useChatId();
    return (
        <>{chatId}</>
    );
}
 
export default ChatPage;