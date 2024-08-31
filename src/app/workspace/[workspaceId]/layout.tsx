"use client"

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { WorkspaceSidebar } from "./workspace-sidebar";
import { useEffect, useState } from "react";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState<boolean>(false);

  const styleSize = `calc(100% - 4px)`;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <div className="bg-[#3f0e40] w-full h-full">
          <ResizablePanelGroup direction="horizontal" autoSaveId="ws-rszbl" className="bg-background rounded-lg" style={{ height: styleSize, width: styleSize }}>
            {mounted && (
              <>
                <ResizablePanel
                  minSize={10}
                  maxSize={20}
                  className="bg-[#522653]/95 p-2"
                >
                  <WorkspaceSidebar />
                </ResizablePanel>
                <ResizableHandle className="bg-[#3f0e40]" />
                <ResizablePanel
                  minSize={20}
                  defaultSize={85}
                >
                  {children}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
