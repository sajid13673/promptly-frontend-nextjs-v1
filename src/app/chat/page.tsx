"use client";

import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";

function Chat() {
  return (
    <div className=" bg-blue-900 flex-grow flex">
      <div className="w-full max-w-md m-auto">
        <h2 className="text-3xl bold mb-3 text-purple-200 text-center font-bold">
          What's on your mind today ?
        </h2>
        <div className="flex flex-col bg-purple-700 p-2 rounded-3xl">
          <form>
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
            />
          </form>
          <button className="cursor-pointer w-fit ml-auto mr-2">
            <ArrowUpCircleIcon className="h-8 w-8 text-purple-200 " />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
