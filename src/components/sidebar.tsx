"use client";

import { getConversations } from "@/lib/api";
import { Conversation } from "@/types/Conversation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Sidebar() {
  const [conversations, setConversations] = useState<[Conversation] | null>(
    null
  );
  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchConversations();
  }, []);
  useEffect(() => {
    console.log("coversations", conversations);
  }, [conversations]);

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.3 }}
      className="w-74 bg-purple-700 text-white flex flex-col shadow-lg relative pt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent minimal-scrollbar"
    >
      <div className="p-2 bg-purple-600 m-2 rounded-2xl">
        <h3 className="space-y-2 font-bold text-lg uppercase">Conversations</h3>
        <div className="flex flex-col mt-2 p-2">
          {conversations &&
            conversations.map((conversation: Conversation) => (
              <Link
                key={conversation.id}
                href={`/conversation/${conversation.id}`}
                className="block px-2 py-2 hover:bg-purple-700 transition-colors rounded-xl"
              >
                {conversation.title}
              </Link>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
