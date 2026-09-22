"use client";

import { deleteConversationById, getConversations } from "@/lib/api";
import { Conversation } from "@/types/Conversation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loadingSpinner";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useConversation } from "@/hooks/useConversation";

export function Sidebar() {
  const {
    data: conversations,
    isLoading: conversationLoading,
    refetch,
  } = useConversation();
  const [deletingConversationId, setDeletingConversationId] = useState<
    number | null
  >(null);
  const pathName = usePathname();
  const isNewChat = pathName === "/";
  const [currentHoveredItem, setCurrentHoveredItem] = useState<number | null>(
    null,
  );
  const [currentPageId, setCurrentPageId] = useState<null | number>(null);
  const router = useRouter();

  const deleteConversation = async (id: number) => {
    try {
      setDeletingConversationId(id);
      await deleteConversationById(id);
      if (id === currentPageId) {
        router.push("/");
      }
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingConversationId(null);
    }
  };
  useEffect(() => {
    setCurrentPageId(parseInt(pathName.replaceAll("/conversation/", "")));
  }, [pathName]);

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.3 }}
      className="w-74 dark:bg-[var(--surface)] text-[var(--text-primary)] flex flex-col shadow-lg dark:shadow-xs dark:shadow-blue-900 relative pt-2 overflow-y-auto scroll-bar-thumb-[var(--scrollbar-thumb)] scrollbar-thin scrollbar-track-transparent p-1"
    >
      {!isNewChat && (
        <Link
          href="/"
          className="flex gap-2 items-center rounded-xl p-2 hover:bg-[var(--primary-hover)]"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span className="space-y-2 font-semibold text-sm ">New chat</span>
        </Link>
      )}
      <div className="p-2 bg-[var(--card)] m-2 rounded-2xl shadow-lg">
        <span className="space-y-2 font-bold text-sm uppercase">
          Conversations
        </span>
        {conversationLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner color="purple" size={4} border={8} />
          </div>
        ) : (
          <div className="flex flex-col mt-1 p-1 gap-1.5">
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation: Conversation) => (
                <div
                  key={conversation.id}
                  className="flex flex-row items-center rounded-xl hover:bg-[var(--primary-hover)] px-2 py-1"
                  onMouseOver={() => setCurrentHoveredItem(conversation.id)}
                  onMouseOut={() => setCurrentHoveredItem(null)}
                >
                  <Link
                    href={`/conversation/${conversation.id}`}
                    className="block transition-colors text-xs"
                  >
                    {conversation.title}
                  </Link>
                  {currentHoveredItem === conversation.id &&
                    deletingConversationId === null && (
                      <button
                        onClick={() => deleteConversation(conversation.id)}
                        className="bg-transparent ml-auto mr-1"
                      >
                        <TrashIcon className="h-4 w-4 text-red-400 hover:h-5 hover:w-5" />
                      </button>
                    )}
                  {deletingConversationId === conversation.id && (
                    <div>
                      <LoadingSpinner color="red" size={2} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-lg font-bold text-gray-300/80 italic">
                No conversations to display
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
