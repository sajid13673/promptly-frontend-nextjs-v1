"use client";
import ChatForm from "@/components/chatForm";
import LoadingSpinner from "@/components/loadingSpinner";
import { generate, getConversationById } from "@/lib/api";
import type { Conversation } from "@/types/Conversation";
import { GenerateResponse } from "@/types/generateResponse";
import { Message } from "@/types/Message";
import { PauseIcon } from "@heroicons/react/24/solid";
import { StopIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import React, { use, useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

function Conversation({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<null | number>(null);
  const buttonStyle = "bg-transparent hover:bg-blue-400 p-0.5";
  const iconStyle = "h-4 w-4 text-[var(--text-secondary)]";

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
  const { speak, cancel, speaking } = useSpeechSynthesis();

  useEffect(() => {
    const fetchConversation = async (): Promise<void> => {
      try {
        setConversationLoading(true);
        const res = await getConversationById(conversationId);
        setConversation(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setConversationLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  const stopSpeak = () => {
    cancel();
  };

  const startSpeaking = (msg: string, id: number) => {
    setCurrentPlayingId(id);
    speak({ text: msg });
  };
  const pauseSpeak = () => {
    setIsPaused(true);
    window.speechSynthesis.pause();
  };

  const resumeSpeak = () => {
    setIsPaused(false);
    window.speechSynthesis.resume();
  };
  return (
    <div className="flex flex-col items-center flex-1 gap-2 p-2 overflow-y-auto scroll-bar-thumb-[var(--scrollbar-thumb)] scrollbar-thin scrollbar-track-transparent">
      {conversationLoading ? (
        <div className="my-auto">
          <LoadingSpinner color="blue" border={8} size={10} />
        </div>
      ) : (
        <div className="text-xs w-full min-w-md lg:max-w-4xl text-white p-3">
          {conversation?.messages &&
            conversation.messages.map((message: Message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      isUser ? "bg-[var(--chat-user-bg)] text-[var(--chat-user-text)]" : "mr-4 text-[var(--chat-ai-text)]"
                    }`}
                  >
                    <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                     components={{
                        table: ({node, ...props}) => (
                          <table className="my-1.5 border-collapse border border-[var(--chat-table-border)] w-full" {...props} />
                        ),
                        th: ({node, ...props}) => (
                          <th className="border border-[var(--chat-table-border)] px-3 py-2 bg-[var(--chat-table-head-bg)] text-left" {...props} />
                        ),
                        td: ({node, ...props}) => (
                          <td className="border border-[var(--chat-table-border)] px-3 py-2" {...props} />
                        ),
                        strong: ({node, ...props}) => (
                          <strong className="font-semibold" {...props} />
                        ),
                      }}
                    >
                    {message.content}
                    </ReactMarkdown>
                    {!isUser && (
                      <div style={{ display: "flex", columnGap: "0.5rem" }}>
                        {!speaking && (
                          <button
                            onClick={() =>
                              startSpeaking(message.content, message.id)
                            }
                            className={buttonStyle}
                          >
                            <PlayIcon className={iconStyle} />
                          </button>
                        )}
                        {currentPlayingId === message.id && (
                          <>
                            {isPaused && (
                              <button
                                onClick={resumeSpeak}
                                className={buttonStyle}
                              >
                                <PlayIcon className={iconStyle} />
                              </button>
                            )}
                            {speaking && !isPaused && (
                              <button
                                onClick={pauseSpeak}
                                className={buttonStyle}
                              >
                                <PauseIcon className={iconStyle} />
                              </button>
                            )}
                            {(speaking || isPaused) && (
                              <button
                                onClick={stopSpeak}
                                className={buttonStyle}
                              >
                                <StopIcon className={iconStyle} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <div className="p-3 sticky bottom-1 w-md mt-auto">
        <ChatForm onSend={onSend} />
      </div>
    </div>
  );
}

export default Conversation;
