import { useParams } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel";

export const useChatId = () => {
    const params = useParams();

    return params.chatId as string;
}