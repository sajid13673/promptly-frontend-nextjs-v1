"use client";

import ChatForm from "@/components/chatForm";
import { generate } from "@/lib/api";
import withAuth from "@/lib/withAuth";
import { Conversation } from "@/types/Conversation";
import { GenerateResponse } from "@/types/generateResponse";
import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res: GenerateResponse = await generate({
        message,
        conversationId: conversation?.id ?? null,
      });
      setConversation(res.conversation);
    } catch (err) {
      console.error(err);
    }
  };
  return (
      <div className="w-full max-w-md m-auto">
        <h2 className="text-3xl bold mb-3 text-purple-200 text-center font-bold">
          What's on your mind today ?
        </h2>
        <ChatForm conversation={conversation} setConversation={setConversation}/>
      </div>
  );
}

export default withAuth(Chat);

