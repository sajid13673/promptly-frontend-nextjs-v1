"use client";

import { Sidebar } from "@/components/sidebar";
import { useContext } from "react";
import { SiteLayoutContext } from "../ClientLayout";
import { SiteLayoutContextType } from "@/types/SiteLayoutContext";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stx: SiteLayoutContextType = useContext(SiteLayoutContext);

  return (
    <div className="bg-[var(--surface-secondary)] flex-grow flex h-dvh overflow-hidden">
      {stx?.sidebarOpen && (
        <div className="w-72 flex-shrink-0 h-full">
          <Sidebar />
        </div>
      )}
      <div className="flex-1 min-w-0 h-full">{children}</div>
    </div>
  );
}
