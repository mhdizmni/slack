"use client"

import { EmojiPicker } from "@/components/emoji-picker";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

const TestPage = () => {
    return (
        <EmojiPicker hint="Emoji">
            <Button
                variant="ghost"
                size="iconSm"
                onClick={() => { }}
            >
                <Smile className="size-4" />
            </Button>
        </EmojiPicker>
    );
}

export default TestPage;