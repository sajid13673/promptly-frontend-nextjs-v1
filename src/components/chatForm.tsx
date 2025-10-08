"use client";

import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";
import { JSX, useState } from "react";
import LoadingSpinner from "./loadingSpinner";

type ChatFormProps = {
  onSend: (message: string) => void | Promise<void>;
};
function ChatForm({ onSend }: ChatFormProps): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSend(message);
    setLoading(false);
    setMessage("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 bg-purple-700 p-2 rounded-3xl">
        <textarea
          rows={1}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            const maxHeight = 200;
            target.style.height = `${Math.min(
              target.scrollHeight,
              maxHeight
            )}px`;
            target.style.overflowY =
              target.scrollHeight > maxHeight ? "scroll" : "hidden";
          }}
          className="w-full resize-none placeholder-purple-200 bg-purple-600 text-white py-3 px-3 rounded-3xl font-semibold transition disabled:opacity-50 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent focus:outline-none focus:ring-0 focus:border-transparent"
          placeholder="Ask anything"
          style={{ maxHeight: "200px" }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-600 rounded-2xl cursor-pointer w-10 h-10 ml-auto mr-2 flex items-center justify-center ${
            loading ? "opacity-80 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <LoadingSpinner size={1.5} color="purple-200" border={4} />
          ) : (
            <ArrowUpCircleIcon className="h-8 w-8 text-purple-200" />
          )}
        </button>
      </div>
    </form>
  );
}

export default ChatForm;
