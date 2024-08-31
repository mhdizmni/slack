import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface HintProps {
    label: string,
    children: React.ReactNode,
    side?: "top" | "right" | "bottom" | "left",
    align?: "start" | "center" | "end",
}

export const Hint = ({
    label,
    children,
    side,
    align
}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    className="bg-primary text-primary-foreground rounded p-1 border-none text-xs"
                >
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}