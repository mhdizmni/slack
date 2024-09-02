import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef } from "react"

const Editor = dynamic(() => import("@/components/editor").then((mod) => mod.default), {
    ssr: false,
})

interface ChatInput {
    placeholder: string
}
export const ChatInput = ({
    placeholder
}: ChatInput) => {
    const editorRef = useRef<Quill | null>(null);

    return (
        <div className="px-4 py-1">
            <Editor
                onSubmit={() => { }}
                onCancel={() => { }}
                disabled={false}
                innerRef={editorRef}
                placeholder={placeholder}
            />
        </div>
    )
}