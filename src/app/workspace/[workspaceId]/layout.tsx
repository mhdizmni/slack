"use client"

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <div className="bg-[#83388a] w-full h-full">
          <div className="bg-background rounded h-[calc(100%-4px)] w-[calc(100%-4px)]">

        {children}
          </div>
        </div>
      </div>
    </div>
  );
}
