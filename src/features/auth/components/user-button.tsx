"use client"

import { useCurrentUser } from "../api/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";

export const UserButton = () => {
    const { data: user, isLoading } = useCurrentUser();
    const { signOut } = useAuthActions();

    if (isLoading) {
        return (
            <Skeleton className="size-9 rounded-lg" />
        )
    }

    if (!user) {
        return null;
    }

    const { image, name, email } = user;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="size-9 hover:opacity-75 rounded-lg [&>*]:rounded-lg">
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>{name!.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut()}
                >
                    <LogOut className="size-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}