"use client";

import { getConversations } from "@/lib/api";
import { Conversation } from "@/types/Conversation";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

type SidebarProps = {
  onClose: () => void;
};

export function Sidebar({ onClose }: SidebarProps) {
  const [conversations, setConversations] =
    useState<[Conversation] | null>(null);
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
      className="w-74 h-screen bg-gray-800 text-white flex flex-col shadow-lg relative"
    >
      <button
        className="absolute top-3 right-3 p-1 rounded hover:bg-gray-700"
        onClick={onClose}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <div className="p-3">
        <h3 className="mt-12 space-y-2 font-bold uppercase">Conversations</h3>
        <div className="flex flex-col  gap-2 mt-3 p-2">
          {conversations &&
            conversations.map((conversation) => (
              <Link key={conversation.id} href={`/${conversation.id}`}>
                {conversation.title}
              </Link>
            ))}
        </div>
      </div>
    </motion.div>
  );
}