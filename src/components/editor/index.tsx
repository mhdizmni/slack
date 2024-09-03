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

import { CaseSensitive, ImageIcon, SendHorizontal, Smile, XIcon } from "lucide-react";
import "quill/dist/quill.snow.css";
import "./styles.css"
import { current } from "../../../convex/members";
import { EmojiPicker } from "../emoji-picker";
import Image from "next/image";

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
    const [image, setImage] = useState<File | null>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disableRef = useRef(disabled);

    const quillRef = useRef<Quill | null>(null)
    const containerRef = useRef<HTMLDivElement>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);

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
                                const text = quill.getText();
                                const addedImage = imageInputRef.current?.files![0] || null;

                                const isEmpty = !addedImage && text.trim().replace(/<(.|\n)*?>/g, "").length === 0;

                                if (isEmpty) return;

                                submitRef.current?.({
                                    body: JSON.stringify(quill.getContents()),
                                    image: addedImage
                                })
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

    const isEmpty = !image && text.trim().replace(/<(.|\n)*?>/g, "").length === 0;

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
        // quill?.focus();
        quill?.setSelection(quill.getLength())
    }

    return (
        <div className="flex flex-col gap-1">
            <div className={cn(
                "border focus-within:shadow w-full rounded-lg overflow-hidden transition",
                disabled && "opacity-50"
            )}>
                <input
                    ref={imageInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple={false}
                    onChange={(event) => setImage(event.target.files![0])}
                />
                <div ref={containerRef} className="h-full ql-custom" spellCheck={false} />
                {image && (
                    <div className="px-2">
                        <div className="relative size-16 group">
                            <Hint label="Remove image">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        imageInputRef.current!.value = "";
                                    }}
                                    className="text-primary-foreground bg-gray-600 rounded-full z-10 size-5 p-0.5 border-2 border-primary-foreground opacity-0 group-hover:opacity-100 transition-all absolute -top-2 -right-2"
                                >
                                    <XIcon />
                                </Button>
                            </Hint>
                            <Image
                                src={URL.createObjectURL(image)}
                                alt="Uploaded Image"
                                fill
                                className="object-contain rounded-xl border border-primary/30"
                            />
                        </div>
                    </div>
                )}
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
                        <EmojiPicker
                            hint="Emoji"
                            onEmojiSelect={onEmojiSelect}
                        >
                            <Button
                                disabled={disabled}
                                variant="ghost"
                                size="iconSm"
                                onClick={() => { }}
                            >
                                <Smile className="size-4" />
                            </Button>
                        </EmojiPicker>
                        {variant === "create" && (
                            <Hint label="Upload Image">
                                <Button
                                    disabled={disabled}
                                    variant="ghost"
                                    size="iconSm"
                                    onClick={() => imageInputRef.current?.click()}
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
                                        onClick={onCancel}
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
                                        onClick={() => {
                                            onSubmit?.({
                                                body: JSON.stringify(quillRef.current?.getContents()),
                                                image
                                            })
                                        }}
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
                                    onClick={() => {
                                        onSubmit?.({
                                            body: JSON.stringify(quillRef.current?.getContents()),
                                            image
                                        })
                                    }}
                                >
                                    <SendHorizontal strokeWidth={2.5} className="size-4" />
                                </Button>
                            </Hint>
                        )}
                    </div>
                </div>
            </div>
            {variant === "create" && (
                <div className={cn(
                    "flex justify-end px-2 opacity-0 transition duration-200",
                    !isEmpty && "opacity-100"
                )}>
                    <p className="text-[10px] text-muted-foreground"><strong>Shift + Enter</strong> to add a new line</p>
                </div>
            )}
        </div>
    )
}

export default Editor;