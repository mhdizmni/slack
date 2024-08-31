import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button"
import { CircleHelp, Search } from "lucide-react";
import { Dots } from "@/components/loaders/dots";

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const { data, isLoading } = useGetWorkspace({id: workspaceId})
    return (
        <div className="flex items-center h-10 p-2 bg-[#3f0e40]">
            <div className="flex-1" />
            <div className="min-w-52 max-w-[550px] grow-[2] shrink">
                <Button
                    className="w-full h-7 bg-accent/25 hover:bg-accent/25 text-white justify-between p-1 gap-1"
                >
                    <div className="flex items-center gap-1">
                        <span>Search</span>
                        {isLoading ? <Dots className="size-1 bg-white" /> : <span className="font-bold">{data?.name}</span>}
                    </div>
                    <Search className="size-4" />
                </Button>
            </div>
            <div className="flex-1 flex justify-end items-center">
                <Button
                    variant="transparent"
                    size="iconSm"
                    className="text-white"
                >
                    <CircleHelp className="size-4" />
                </Button>
            </div>
        </div>
    )
}