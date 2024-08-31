import { cn } from '@/lib/utils'

interface Props {
    className?: string,
}

export const Dots = ({
    className,
}: Props) => {
    return (
        <div className="flex items-center gap-1 *:animate-dots *:rounded-full" dir="ltr">
            {[1,2,3].map((_, i) => {
                const animationDelayStyle = {
                    animationDelay: `${i*100}ms`,
                };
                return (
                    <div
                        key={i}
                        className={cn(
                            "bg-current size-2",
                            !!className && className
                        )}
                        style={animationDelayStyle}
                    />
                )
            })}
        </div>
    )
}