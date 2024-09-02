import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetUserInfoProps {
    userId: string;
}

export type UserInfo = {
    name?: string,
    email?: string,
    image?: string
}

export const useGetUserInfo = ({ userId }: UseGetUserInfoProps) => {
    const data = useQuery(api.users.getInfoById, { userId });
    const isLoading = data === undefined;

    return { data, isLoading };
}