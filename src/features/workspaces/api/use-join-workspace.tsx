import { useCallback, useState } from "react";
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { workspaceId: Id<"workspaces">, joinCode: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
    onSuccess?: (data: ResponseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError?: boolean
}

export const useJoinWorkspace = () => {
    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);

    const [isPending, setIsPending] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isSettled, setIsSettled] = useState<boolean>(false);

    const mutation = useMutation(api.workspaces.join);

    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null);
            setError(null);
            setIsSuccess(false);
            setIsError(false);
            setIsSettled(false);
            
            setIsPending(true);

            const response = await mutation(values);
            options?.onSuccess?.(response);
            setData(response)
            return response;
        } catch (error) {
            setIsError(true);
            setError(error as Error);
            options?.onError?.(error as Error);
            if (options?.throwError) {
                throw error
            }
        } finally {
            setIsPending(false);
            setIsSettled(true);

            options?.onSettled?.();
        }
    }, [mutation])

    return {
        mutate,
        data,
        error,
        isPending,
        isSuccess,
        isError,
        isSettled
    }
}