import { Button } from "@/components/ui/button"
import { UserInfo } from "@/features/users/api/use-get-user-info"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"

interface UserHeaderProps {
    user: UserInfo
};

export const UserHeader = ({
    user
}: UserHeaderProps) => {
    return (
        <div className="flex items-start justify-between gap-1 p-4 h-16 border-b">
            <Button
                variant="ghost"
                className="justify-start h-7 p-1 font-bold text-lg truncate"
            >
                <div className="flex items-center gap-1">
                    <Avatar className="rounded size-5 shrink-0">
                        <AvatarImage className="rounded" src={user.image || ""} alt={user.name || "User"} />
                        <AvatarFallback className="rounded text-primary">{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.name || "User"}</span>
                </div>
                {/* <ChevronDown className="size-4 shrink-0" /> */}
            </Button>
        </div>
    )
}