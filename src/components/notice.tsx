import { cloneElement } from "react"
import {
    Card,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

import { TriangleAlert } from "lucide-react"

interface Props {
    type?: "error" | "success" | "warning" | "info",
    children: React.ReactNode,
    icon?: React.ReactElement,
    showIcon?: boolean,
    className?: string
}

export const Notice = ({
    type = "info",
    children,
    icon = <TriangleAlert />,
    showIcon = false,
    className
}: Props) => {
    return (
        <Card className={cn(
            "[&>*>p]:text-xs",
            type === "error" && "border-red-900 bg-red-50 [&>*>*]:!text-red-950",
            type === "success" && "border-green-900 bg-green-50 [&>*>*]:!text-green-950",
            type === "warning" && "border-yellow-900 bg-yellow-50 [&>*>*]:!text-yellow-950",
            type === "info" && "border-blue-900 bg-blue-50 [&>*>*]:!text-blue-950",
            className && className
        )}>
            <CardHeader className="p-3 flex-row gap-2 items-center">
                {showIcon && (
                    <div className="size-4 shrink-0">
                        {!!icon &&
                            cloneElement(icon, {
                                className: "size-full"
                            })
                        }
                    </div>
                )}
                <CardDescription className="!m-0">
                    {children}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}