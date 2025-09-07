import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Text Generator",
    template: "%s | AI Text Generator",
  },
  description: "AI-powered text generation and chat interface",
  keywords: ["AI", "Chat", "Text Generator", "Laravel", "Next.js"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "AI Text Generator",
    description: "Chat and generate text using AI",
    url: "https://your-domain.com",
    siteName: "AI Text Generator",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full bg-gradient-to-r from-blue-50 to-purple-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Global header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow">
          <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
            <h1 className="text-lg font-bold text-white">AI Text Generator</h1>
            <nav className="space-x-4">
              <Link
                href="/settings"
                className="text-white hover:text-blue-100 transition"
              >
                Settings
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex">{children}</main>

        {/* Global footer */}
        <footer className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-center text-sm text-white">
          © {new Date().getFullYear()} AI Text Generator. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
