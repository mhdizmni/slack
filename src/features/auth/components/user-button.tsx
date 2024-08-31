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
import { LogOut } from "lucide-react";
import { Dots } from "@/components/loaders/dots";
import { useRouter } from "next/navigation";

export const UserButton = () => {
    const router = useRouter();
    const { data: user, isLoading } = useCurrentUser();
    const { signOut } = useAuthActions();

    if (isLoading) {
        return (
            <div className="size-9 rounded-lg flex items-center justify-center bg-accent/50">
                <Dots className="size-1 bg-white" />
            </div>
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
            <DropdownMenuContent align="center" side="right" className="p-0 py-1">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                        await signOut()
                        .then(() => router.push("/"))
                    }}
                >
                    <LogOut className="size-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}