import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Hash, LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link"
import { useCurrentUser } from "@/features/auth/api/use-current-user"
import { Badge } from "@/components/ui/badge"

const sidebarItemVariants = cva(
    "justify-start h-7 gap-2",
    {
        variants: {
            variant: {
                default: "text-accent",
                active: "!bg-accent/75 text-[#522653]"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

type SidebarItemProps = {
    id: string
    label: string,
    variant?: VariantProps<typeof sidebarItemVariants>["variant"]
    icon?: LucideIcon
    image?: string,
    name?: string
}

export const SidebarItem = ({
    id,
    variant,
    label,
    icon: Icon,
    image,
    name
}: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();
    const { data: user } = useCurrentUser();

    return (
        <Button
            variant="transparent"
            className={cn(sidebarItemVariants({ variant: variant }))}
            asChild
        >
            <Link href={`/workspace/${workspaceId}/${id}`}>
                {name ? (
                    <Avatar className="rounded size-5 shrink-0">
                        <AvatarImage className="rounded" src={image || ""} alt={name} />
                        <AvatarFallback className="rounded text-primary">{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                ) : (
                    <>
                        {Icon ? (
                            <Icon className="size-4 shrink-0" />
                        ) : (
                            <Hash className="size-4 shrink-0" />
                        )}
                    </>
                )}
                <span className="text-sm truncate">{label}</span>
                {user?._id === id && (
                    <Badge className="text-xs p-0.5 px-1 rounded leading-[12px] scale-75 bg-[#3f0e40]">you</Badge>
                )}
            </Link>
        </Button>
    )
}