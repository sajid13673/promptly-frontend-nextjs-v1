import type { Metadata } from "next";
import "../globals.css";
import ClientLayout from "./ClientLayout";

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
      <body className="antialiased min-h-screen flex flex-col">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
