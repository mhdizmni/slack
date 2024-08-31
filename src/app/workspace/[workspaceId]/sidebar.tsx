import { UserButton } from "@/features/auth/components/user-button"
import { WorkspaceSwither } from "./workspace-switcher"

export const Sidebar = () => {
    return (
        <aside className="flex flex-col items-center justify-between shrink-0 gap-2 pt-2 pb-6 w-[70px] bg-[#3f0e40]">
            <WorkspaceSwither />
            <UserButton />
        </aside>
    )
}