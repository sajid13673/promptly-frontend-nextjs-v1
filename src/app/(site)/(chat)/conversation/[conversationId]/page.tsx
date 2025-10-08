"use client";
import ChatForm from "@/components/chatForm";
import LoadingSpinner from "@/components/loadingSpinner";
import { generate, getConversationById } from "@/lib/api";
import type { Conversation } from "@/types/Conversation";
import { GenerateResponse } from "@/types/generateResponse";
import { Message } from "@/types/Message";
import React, { use, useEffect, useState } from "react";

function Conversation({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  console.log("conversation", conversationId);

  const fetchConversation = async (): Promise<void> => {
    try {
      setConversationLoading(true);
      const res = await getConversationById(conversationId);
      setConversation(res.data);
    } catch (error) {
      console.error(error);
    }
    finally{
      setConversationLoading(false);
    }
  };

  const onSend = async (message: string): Promise<void> => {
    try {
      const res: GenerateResponse = await generate({
        message: message,
        conversationId: conversation?.id || null,
      });
      setConversation(res.conversation);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, []);

  return (
    <div className="flex flex-col items-center flex-1 gap-2 p-2 overflow-y-auto minimal-scrollbar">
      {conversationLoading ? (
        <div className="my-auto">
          <LoadingSpinner color="white" border={8} size={10} />
        </div>
      ) : (
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
      )}
      <div className="mt-auto w-md p-3">
        <ChatForm onSend={onSend} />
      </div>
    </div>
  );
}

export default Conversation;
