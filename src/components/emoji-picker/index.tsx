"use client"

import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

import "./styles.css"

interface EmojiPickerProps {
    children: React.ReactNode;
    hint?: string;
    onEmojiSelect?: (emoji: any) => void;
}
export const EmojiPicker = ({
    children,
    hint,
    onEmojiSelect,
}: EmojiPickerProps) => {
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const onSelect = (emoji: any) => {
        onEmojiSelect?.(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 500);
    }

    return (
        <TooltipProvider>
            <Popover
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
            >
                <Tooltip
                    open={tooltipOpen}
                    onOpenChange={setTooltipOpen}
                    delayDuration={50}
                >
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent
                        className="bg-primary text-primary-foreground rounded p-1 border-none text-xs"
                    >
                        {hint}
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="rounded-lg p-0 overflow-hidden w-fit emoji-picker">
                    <Picker
                        data={data}
                        onEmojiSelect={onSelect}
                        autoFocus
                        dynamicWidth
                        emojiButtonRadius="6px"
                        emojiButtonSize={36}
                        emojiSize={22}
                        emojiButtonColors={[
                            "rgba(155,223,88,.7)",
                            "rgba(149,211,254,.7)",
                            "rgba(247,233,34,.7)",
                            "rgba(238,166,252,.7)",
                            "rgba(255,213,143,.7)",
                            "rgba(211,209,255,.7)",
                        ]}
                    />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}