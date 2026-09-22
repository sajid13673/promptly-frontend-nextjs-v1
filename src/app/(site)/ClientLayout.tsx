"use client";

import ThemeToggle from "@/components/themeToggle";
import { logoutUser } from "@/lib/api";
import { SiteLayoutContextType } from "@/types/SiteLayoutContext";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { createContext, useState } from "react";

export const SiteLayoutContext = createContext<SiteLayoutContextType>(null);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const buttonStyle = "text-[var(--text-primary)] hover:bg-[var(--secondary-hover)] transition rounded-xl";

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] shadow px-4 py-1 flex items-center gap-1.5">
            <h1 className="text-sm font-bold text-[var(--text-primary)]">Promptly AI</h1>
            <div className="relative group mr-auto">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 ml-2 bg-transparent hover:bg-[var(--primary-hover)]"
              >
                {sidebarOpen ? (
                  <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
                ) : (
                  <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                )}
              </button>
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-red bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              </span>
            </div>
            <ThemeToggle />
            <nav className="space-x-4 text-xs">
              <Link href="/settings" className={`${buttonStyle} px-2 py-3`}>
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className={`${buttonStyle} p-2 bg-transparent`}
              >
                Logout
              </button>
            </nav>
          </header>

          <main className="flex-grow flex flex-col overflow-y-auto">
            {children}
          </main>

          <footer className="text-xs bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-2 text-center text-[var(--text-primary)]">
            © {new Date().getFullYear()} AI Text Generator. All rights reserved.
          </footer>
        </div>
      </SiteLayoutContext.Provider>
    </QueryClientProvider>
  );
}
