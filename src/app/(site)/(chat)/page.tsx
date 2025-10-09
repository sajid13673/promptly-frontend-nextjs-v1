"use client";

import ChatPage from "@/components/chatPage";
import withAuth from "@/lib/withAuth";
import { withClientWrapper } from "@/lib/withClientWrapper";

export default function Page() {
  const ChatWrapper = withClientWrapper(ChatPage, withAuth);
  return <ChatWrapper />;
}