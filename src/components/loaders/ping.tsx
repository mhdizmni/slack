import { cn } from "@/lib/utils"

interface Props {
    className?: string
}
export const Ping = ({
    className
}: Props) => {
    return (
        <div className="relative flex">
            {Array.from({ length: 2 }, (_, i) => (
                <div
                    key={i}
                    className={cn(
                        "inline-flex rounded-full",
                        i === 0 && "animate-ping absolute opacity-75",
                        i === 1 && "relative",
                        className ? className : "size-1.5 bg-current"
                    )}
                />
            ))}
            {/* <span className="animate-ping absolute opacity-75 bg-inherit"></span>
            <span className="relative"></span> */}
        </div>
    )
}