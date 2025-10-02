"use client";

import { logoutUser } from "@/lib/api";
import { SiteLayoutContextType } from "@/types/SiteLayoutContext";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { createContext, useState } from "react";

export const SiteLayoutContext = createContext<SiteLayoutContextType>(null);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SiteLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex flex-col min-h-screen">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow px-4 py-2 flex items-center">
          <h1 className="text-lg font-bold text-white">AI Text Generator</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-lg font-bold rounded-xl hover:bg-blue-700 p-1.5 text-white ml-2 mr-auto"
          >
            {sidebarOpen ? (
              <ArrowLeftStartOnRectangleIcon className="h-7 w-7" />
            ) : (
              <ArrowRightStartOnRectangleIcon className="h-7 w-7" />
            )}
          </button>
          <nav className="space-x-4">
            <Link
              href="/settings"
              className="text-white hover:bg-purple-800 p-2 rounded-xl transition"
            >
              Settings
            </Link>
            <button onClick={handleLogout} className="cursor-pointer text-white hover:bg-purple-800 p-2 rounded-xl transition">logout</button>
          </nav>
        </header>

        <main className="flex-grow flex flex-col overflow-y-auto">{children}</main>

        <footer className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-center text-sm text-white">
          © {new Date().getFullYear()} AI Text Generator. All rights reserved.
        </footer>
      </div>
    </SiteLayoutContext.Provider>
  );
}
