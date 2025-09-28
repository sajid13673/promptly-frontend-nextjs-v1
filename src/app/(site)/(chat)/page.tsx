"use client";

import ChatForm from "@/components/chatForm";
import { generate } from "@/lib/api";
import withAuth from "@/lib/withAuth";
import { Conversation } from "@/types/Conversation";
import { GenerateResponse } from "@/types/generateResponse";
import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Chat() {
  // const [message, setMessage] = useState<string>("");
  // const [conversation, setConversation] = useState<Conversation | null>(null);
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res: GenerateResponse = await generate({
  //       message,
  //       conversationId: conversation?.id ?? null,
  //     });
  //     setConversation(res.conversation);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const router = useRouter();
  return (
    <div className="w-full max-w-md m-auto">
      <h2 className="text-3xl bold mb-3 text-purple-200 text-center font-bold">
        What's on your mind today ?
      </h2>
      <ChatForm
        onSend={async (message) => {
          try {
            const res: GenerateResponse = await generate({
              message: message,
              conversationId: null,
            });
            router.push(`/${res.conversation.id}`);
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </div>
  );
}

export default withAuth(Chat);

