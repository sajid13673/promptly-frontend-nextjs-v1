"use client";

import { ArrowUpCircleIcon, MicrophoneIcon } from "@heroicons/react/16/solid";
import { JSX, useState, useCallback, useRef, useEffect } from "react";
import LoadingSpinner from "./loadingSpinner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { transcribe } from "@/lib/api";
import { StopCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { WaveformVisualizer } from "./waveformVisualizer";
import { useTheme } from "next-themes";

type ChatFormProps = {
  onSend: (message: string) => Promise<void>;
  onTranscript?: (text: string) => void;
};

const buttonStyle = "rounded-xl w-8 h-8 flex items-center justify-center";
const iconStyle = "h-5 w-5";

function ChatForm({ onSend, onTranscript }: ChatFormProps): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const sendMessageMutation = useMutation({
    mutationFn: onSend,
    onSuccess: () => {
      setMessage("");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    sendMessageMutation.mutate(message);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [languageError, setLanguageError] = useState<string | null>(null);

  const uploadRecording = useCallback(
    async (blob: Blob) => {
      setUploadError(null);
      setLanguageError(null);
      try {
        setUploading(true);
        const res = await transcribe(blob);
        if (res.language === "en") {
          setMessage(res.text);
        } else {
          setLanguageError('Sorry, only English is currently supported.')
        }
      } catch (err) {
        console.error(err);
        setUploadError("Failed to send recording");
      } finally {
        setUploading(false);
      }
    },
    [onTranscript],
  );

  const {
    status,
    error,
    volume,
    startRecording,
    stopRecording,
    cancelRecording,
    analyserRef,
  } = useVoiceRecorder({
    silenceThreshold: 15,
    silenceDuration: 1500,
    maxDuration: 60_000,
    onRecordingComplete: uploadRecording,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const target = textareaRef.current;
    if (!target) return;

    target.style.height = "auto";
    const maxHeight = 200;
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
    target.style.overflowY =
      target.scrollHeight > maxHeight ? "scroll" : "hidden";
  }, [message]);
  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="flex flex-col gap-2 bg-[var(--card)] p-2 rounded-3xl">
        {status !== "recording" ? (
          <textarea
            ref={textareaRef}
            value={message}
            rows={1}
            onKeyDown={handleKeyDown}
            className="text-xs w-full resize-none placeholder-[var(--input-placeholder-secondary)] bg-[var(--input-background)] text-[var(--text-secondary)] py-3 px-3 rounded-3xl font-semibold transition disabled:opacity-50 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent focus:outline-none focus:ring-0 focus:border-transparent"
            placeholder="Ask anything"
            style={{ maxHeight: "200px" }}
            onChange={(e) => setMessage(e.target.value)}
          />
        ) : (
          <div className="flex-1 bg-[var(--primary)] rounded-3xl px-2 py-1">
            <WaveformVisualizer
              analyserRef={analyserRef}
              isActive={status === "recording"}
              color={isDark ? "#ffffff" : "#4e097c"}
            />
          </div>
        )}
        <div className="flex justify-end items-center gap-1">
          {status === "idle" && !uploading && !loading && (
            <button
              onClick={startRecording}
              className={`bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] ${buttonStyle}`}
              aria-label="Start recording"
            >
              <MicrophoneIcon className={iconStyle} />
            </button>
          )}

          <div className="flex items-center gap-3">
            {status === "requesting" && (
              <div className={`${buttonStyle}  text-purple-400 dark:text-gray-400`}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}

            {status === "recording" && (
              <>
                <button
                  type="button"
                  onClick={stopRecording}
                  className={`bg-red-400 ${buttonStyle}`}
                  aria-label="Stop recording"
                >
                  <StopCircleIcon className={iconStyle} />
                </button>
                <button
                  onClick={cancelRecording}
                  className={`bg-red-400 ${buttonStyle}`}
                  aria-label="Cancel recording"
                >
                  <XCircleIcon className={iconStyle} />
                </button>
              </>
            )}

            {(status === "processing" || uploading) && (
              <div className={`${buttonStyle} text-purple-400 dark:text-gray-400`}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
          </div>
          {status !== "requesting" && status !== "recording" && !uploading && (
            <button
              type="submit"
              disabled={loading}
              className={`bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] ${buttonStyle} ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <LoadingSpinner size={1.5} color="white" border={4} />
              ) : (
                <ArrowUpCircleIcon className={iconStyle} />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {(error || uploadError || languageError) && (
          <p className="text-sm text-red-500">{error || uploadError || languageError}</p>
        )}
      </div>
    </form>
  );
}

export default ChatForm;
