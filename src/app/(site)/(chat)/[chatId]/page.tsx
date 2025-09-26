"use client";
import ChatForm from "@/components/chatForm";
import { getConversationById } from "@/lib/api";
import type { Conversation } from "@/types/Conversation";
import { Message } from "@/types/Message";
import React, { use, useEffect, useState } from "react";

function Conversation({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  console.log("conversation", chatId);

  const fetchConversation = async () => {
    const res = await getConversationById(chatId);
    setConversation(res.data);
  };

  useEffect(() => {
    fetchConversation();
  }, []);

  return (
    <div className="flex flex-col items-center flex-1 gap-2 p-2">
      <div className="w-full min-w-md lg:max-w-4xl text-white p-3">
        {conversation?.messages &&
          conversation.messages.map((message: Message) => {
            const isUser = message.role === "USER";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`text-lg p-3 rounded-xl text-white ${
                    isUser ? "bg-blue-600/40" : "mr-4"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            );
          })}
      </div>
      <div className="mt-auto w-md p-3">
        <ChatForm conversation={conversation} setConversation={setConversation}/>
      </div>
    </div>
  );
}

export default Conversation;
