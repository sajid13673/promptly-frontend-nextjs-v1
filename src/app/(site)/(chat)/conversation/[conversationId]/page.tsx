"use client";
import ChatForm from "@/components/chatForm";
import LoadingSpinner from "@/components/loadingSpinner";
import { ApiError, generate, getConversationById } from "@/lib/api";
import type { Conversation } from "@/types/Conversation";
import { GenerateResponse } from "@/types/generateResponse";
import { Message } from "@/types/Message";
import { PauseIcon } from "@heroicons/react/24/solid";
import { StopIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import React, { use, useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { stripMarkdown } from "@/utils/markdown";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { SiteLayoutContext } from "@/app/(site)/ClientLayout";
import StickyHeader from "@/components/stickyHeader";
import rehypeHighlight from "rehype-highlight";
import { notFound } from "next/navigation";

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
  const [conversationNotFound, setConversationNotFound] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const buttonStyle = "bg-transparent hover:bg-blue-400 p-0.5";
  const iconStyle = "h-4 w-4 text-[var(--text-secondary)]";
  const ctx = useContext(SiteLayoutContext);
  if (!ctx) {
    throw new Error(
      "useContext(SiteLayoutContext) must be used within SiteLayoutContext.Provider",
    );
  }
  const { sidebarOpen } = ctx;

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
        setConversationNotFound(false);
        setLoadError(null);
        setConversationLoading(true);
        const res = await getConversationById(conversationId);
        setConversation(res.data);
      } catch (error) {
        if (
          error instanceof ApiError &&
          (error.status === 404 || error.status === 400)
        ) {
          setConversationNotFound(true);
        } else {
          console.error(error);
          setLoadError(
            error instanceof Error ? error : new Error("Something went wrong"),
          );
        }
      } finally {
        setConversationLoading(false);
      }
    };
    fetchConversation();
  }, [conversationId]);

  if (conversationNotFound) {
    notFound();
  }
  if (loadError) {
    throw loadError;
  }

  const stopSpeak = () => {
    setIsPaused(false);
    cancel();
  };

  const startSpeaking = (msg: string, id: number) => {
    const plainText = stripMarkdown(msg);
    setCurrentPlayingId(id);
    speak({ text: plainText });
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
    <div className="flex flex-col items-center flex-1 gap-2 overflow-y-auto scroll-bar-thumb-[var(--scrollbar-thumb)] scrollbar-thin scrollbar-track-transparent">
      {conversationLoading ? (
        <div className="my-auto">
          <LoadingSpinner color="blue" border={8} size={10} />
        </div>
      ) : (
        <div className="text-xs w-full text-white flex flex-col items-center">
          <StickyHeader
            title={stripMarkdown(
              conversation?.title ?? "Untitled Conversation",
            )}
            isSidebarOpen={sidebarOpen}
          />
          <div className="p-1.5 m-3 md:min-w-md lg:max-w-4xl w-full">
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
                        isUser
                          ? "bg-[var(--chat-user-bg)] text-[var(--chat-user-text)] ml-7"
                          : "text-[var(--chat-ai-text)] flex-1 min-w-0 "
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="p-1 overflow-x-auto max-w-full my-1.5 scroll-bar-thumb-[var(--scrollbar-thumb)] scrollbar-thin scrollbar-track-transparent">
                              <table
                                className="border-collapse border border-[var(--chat-table-border)] w-full"
                                {...props}
                              />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="border border-[var(--chat-table-border)] px-3 py-2 bg-[var(--chat-table-head-bg)] text-left whitespace-nowrap"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              className="border border-[var(--chat-table-border)] px-3 py-2 whitespace-nowrap"
                              {...props}
                            />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold" {...props} />
                          ),

                          pre: ({ node, ...props }) => (
                            <pre
                              className="my-2 p-3 max-w-full overflow-x-auto rounded-lg bg-[var(--chat-code-bg)] text-sm scroll-bar-thumb-[var(--scrollbar-thumb)] scrollbar-thin scrollbar-track-transparent [&_code]:bg-transparent [&_code]:p-0 [&_code]:rounded-none"
                              {...props}
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="px-1.5 py-0.5 rounded bg-[var(--chat-code-bg)] font-mono text-[0.85em]"
                              {...props}
                            />
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
        </div>
      )}

      <div
        className={`p-3 sticky bottom-1 sm:w-md mt-auto w-full ${
          sidebarOpen ? "hidden sm:block" : ""
        }`}
      >
        <ChatForm onSend={onSend} />
      </div>
    </div>
  );
}

export default Conversation;
