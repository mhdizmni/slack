import { useToggle } from "react-use";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";

interface WorkspaceSectionProps {
    children: React.ReactNode
    label: string
    hint?: string
    onNew?: () => void
}

export const WorkspaceSection = ({
    children,
    hint,
    label,
    onNew,
}: WorkspaceSectionProps) => {
    const [on, toggle] = useToggle(true)
    return (
        <div className="flex flex-col gap-2 group">
            <div className="flex items-center justify-between px-3">
                <div className="flex items-center justify-start gap-1">
                    <Button
                        variant="transparent"
                        className="size-6 p-0"
                        onClick={toggle}
                    >
                        <ChevronRight strokeWidth={3} className={cn(
                            "size-4",
                            on && "rotate-90"
                        )} />
                    </Button>
                    <span className="text-sm font-semibold">{label}</span>
                </div>
                {onNew && (
                    <Hint label={hint || "New"}>
                        <Button
                            variant="transparent"
                            size="iconSm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={toggle}
                        >
                            <Plus className="size-4" />
                        </Button>
                    </Hint>
                )}
            </div>
            {on && children}
        </div>
    )
}