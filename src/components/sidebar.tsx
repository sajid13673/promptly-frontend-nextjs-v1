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

export function Sidebar() {
  const [conversations, setConversations] = useState<[Conversation] | null>(
    null,
  );
  const [conversationLoading, setConversationLoading] = useState(false);
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

  const fetchConversations = async () => {
    try {
      setConversationLoading(true);
      const res = await getConversations();
      setConversations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setConversationLoading(false);
    }
  };
  const deleteConversation = async (id: number) => {
    try {
      setDeletingConversationId(id);
      await deleteConversationById(id);
      if (id === currentPageId) {
        router.push("/");
      }
      fetchConversations();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingConversationId(null);
    }
  };
  useEffect(() => {
    fetchConversations();
  }, []);
  useEffect(() => {
    setCurrentPageId(parseInt(pathName.replaceAll("/conversation/", "")));
  }, [pathName]);

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.3 }}
      className="w-74 bg-purple-700 text-white flex flex-col shadow-lg relative pt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent minimal-scrollbar p-1"
    >
      {!isNewChat && (
        <Link
          href="/"
          className="flex gap-2 items-center rounded-xl p-2 hover:bg-purple-500"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <h3 className="space-y-2 font-semibold text-lg ">New chat</h3>
        </Link>
      )}
      <div className="p-2 bg-purple-600 m-2 rounded-2xl">
        <h3 className="space-y-2 font-bold text-lg uppercase">Conversations</h3>
        {conversationLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner color="purple" size={4} border={8} />
          </div>
        ) : (
          <div className="flex flex-col mt-2 p-2">
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation: Conversation) => (
                <div
                  key={conversation.id}
                  className="flex flex-row items-center rounded-xl hover:bg-purple-700 px-2 py-2"
                  onMouseOver={() => setCurrentHoveredItem(conversation.id)}
                  onMouseOut={() => setCurrentHoveredItem(null)}
                >
                  <Link
                    href={`/conversation/${conversation.id}`}
                    className="block transition-colors "
                  >
                    {conversation.title}
                  </Link>
                  {(currentHoveredItem === conversation.id &&
                    deletingConversationId === null) && (
                      <button
                        onClick={() => deleteConversation(conversation.id)}
                      >
                        <TrashIcon className="h-5 w-5 text-red-400 hover:h-6 hover:w-6" />
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
