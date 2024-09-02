"use client"

import {
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";

import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

import { cn } from "@/lib/utils";

import { CaseSensitive, ImageIcon, SendHorizontal, Smile } from "lucide-react";
import "quill/dist/quill.snow.css";
import "./styles.css"
import { current } from "../../../convex/members";

type EditorValue = {
    image: File | null;
    body: string;
}
interface EditorProps {
    onSubmit?: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    innerRef?: MutableRefObject<Quill | null>;
    disabled?: boolean;
    variant?: "create" | "update";
}
const Editor = ({
    onSubmit,
    onCancel,
    placeholder = "Write down something...",
    defaultValue = [],
    innerRef,
    disabled = false,
    variant = "create"
}: EditorProps) => {
    const [text, setText] = useState<string>("");
    const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disableRef = useRef(disabled);

    const quillRef = useRef<Quill | null>(null)
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disableRef.current = disabled;
    })

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        )

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ "list": "ordered" }, { "list": "bullet" }],
                    ["blockquote", "code-block"],
                    ["clean"]
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                return;
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
            if (container) {
                container.innerHTML = "";
            }
        }
    }, []);

    const tooggleToolbar = () => {
        setIsToolbarVisible((current) => !current);

        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
        if (toolbarElement) {
            toolbarElement.classList.toggle("!hidden");
        }
    }

    const isEmpty = text.trim().replace(/<(.|\n)*?>/g, "").length === 0;

    return (
        <div className="flex flex-col gap-1">
            <div className="border focus-within:shadow w-full rounded-lg overflow-hidden transition">
                <div ref={containerRef} className="h-full ql-custom" />
                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-1">
                        <Hint label={isToolbarVisible ? "Hide Toolbar" : "Show Toolbar"}>
                            <Button
                                variant="ghost"
                                size="iconSm"
                                onClick={tooggleToolbar}
                            >
                                <CaseSensitive className="size-4" />
                            </Button>
                        </Hint>
                        <Hint label="Emoji">
                            <Button
                                disabled={disabled}
                                variant="ghost"
                                size="iconSm"
                                onClick={() => { }}
                            >
                                <Smile className="size-4" />
                            </Button>
                        </Hint>
                        {variant === "create" && (
                            <Hint label="Upload Image">
                                <Button
                                    disabled={disabled}
                                    variant="ghost"
                                    size="iconSm"
                                    onClick={() => { }}
                                >
                                    <ImageIcon className="size-4" />
                                </Button>
                            </Hint>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {variant === "update" && (
                            <>
                                <Hint label="Cancel Edit">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="font-bold text-xs"
                                        onClick={() => { }}
                                    >
                                        Cancel
                                    </Button>
                                </Hint>
                                <Hint label="Save Edit">
                                    <Button
                                        disabled={disabled || isEmpty}
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            "bg-emerald-700 hover:bg-emerald-700/75 !text-white",
                                            isEmpty && "bg-transparent !text-primary"
                                        )}
                                        onClick={() => { }}
                                    >
                                        Save
                                    </Button>
                                </Hint>
                            </>
                        )}
                        {variant === "create" && (
                            <Hint label="Send">
                                <Button
                                    disabled={disabled || isEmpty}
                                    size="iconSm"
                                    className={cn(
                                        "bg-emerald-700 hover:bg-emerald-700/75 !text-white",
                                        isEmpty && "bg-transparent !text-primary"
                                    )}
                                    onClick={() => { }}
                                >
                                    <SendHorizontal strokeWidth={2.5} className="size-4" />
                                </Button>
                            </Hint>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-2">
                <p className="text-[10px] text-muted-foreground"><strong>Shift + Enter</strong> to add a new line</p>
            </div>
        </div>
    )
}

export default Editor;