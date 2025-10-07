"use client";

import ChatForm from "@/components/chatForm";
import { generate } from "@/lib/api";
import withAuth from "@/lib/withAuth";
import { GenerateResponse } from "@/types/generateResponse";
import { useRouter } from "next/navigation";

function Chat() {
  const router = useRouter();
  const onSend = async (message: string): Promise<void> => {
    try {
      const res: GenerateResponse = await generate({
        message: message,
        conversationId: null,
      });
      router.push(`/conversation/${res.conversation.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full max-w-md m-auto">
      <h2 className="text-3xl bold mb-3 text-purple-200 text-center font-bold">
        What's on your mind today ?
      </h2>
      <ChatForm onSend={onSend} />
    </div>
  );
}

export default withAuth(Chat);
