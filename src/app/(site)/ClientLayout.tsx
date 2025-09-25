"use client";

import { logoutUser } from "@/lib/api";
import { SiteLayoutContextType } from "@/types/SiteLayoutContext";
import { ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { createContext, useState } from "react";

export const SiteLayoutContext = createContext<SiteLayoutContextType>(null);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <SiteLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow">
        <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-white">AI Text Generator</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-lg font-bold text-white ml-2 mr-auto"
          >
            {sidebarOpen ? <ArrowLeftStartOnRectangleIcon className="h-8 w-8"/> : <ArrowRightStartOnRectangleIcon className="h-8 w-8"/>}
          </button>
          <nav className="space-x-4">
            <Link href="/settings" className="text-white hover:text-blue-100 transition">
              Settings
            </Link>
            <button onClick={handleLogout}>logout</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex">{children}</main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-center text-sm text-white">
        © {new Date().getFullYear()} AI Text Generator. All rights reserved.
      </footer>
    </SiteLayoutContext.Provider>
  );
}
