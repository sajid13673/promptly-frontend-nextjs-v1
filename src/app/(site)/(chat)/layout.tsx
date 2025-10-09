"use client";

import { Sidebar } from "@/components/sidebar";
import { useContext } from "react";
import { SiteLayoutContext } from "../ClientLayout";
import { SiteLayoutContextType } from "@/types/SiteLayoutContext";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const stx: SiteLayoutContextType = useContext(SiteLayoutContext);

  return (
    <div className=" bg-blue-900 flex-grow flex h-screen overflow-hidden">
      {stx?.sidebarOpen && <Sidebar/>}
      {children}
    </div>
  );
}
