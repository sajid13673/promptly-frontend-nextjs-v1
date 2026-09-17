"use client";

import { ArrowUpCircleIcon, MicrophoneIcon } from "@heroicons/react/16/solid";
import { JSX, useState, useCallback } from "react";
import LoadingSpinner from "./loadingSpinner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { transcribe } from "@/lib/api";
import { StopCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

type ChatFormProps = {
  onSend: (message: string) => Promise<void>;
  onTranscript?: (text: string) => void;
};

const buttonStyle = "rounded-2xl w-10 h-10 flex items-center justify-center";

function ChatForm({ onSend, onTranscript }: ChatFormProps): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const uploadRecording = useCallback(
    async (blob: Blob) => {
      setUploadError(null);
      try {
        const res = await transcribe(blob);

        // onTranscript?.(res.text ?? '');
      } catch (err) {
        console.error(err);
        setUploadError("Failed to send recording");
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
  } = useVoiceRecorder({
    silenceThreshold: 15,
    silenceDuration: 1500,
    maxDuration: 60_000,
    onRecordingComplete: uploadRecording,
  });
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 bg-purple-700 p-2 rounded-3xl">
        <textarea
          value={message}
          rows={1}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            const maxHeight = 200;
            target.style.height = `${Math.min(
              target.scrollHeight,
              maxHeight,
            )}px`;
            target.style.overflowY =
              target.scrollHeight > maxHeight ? "scroll" : "hidden";
          }}
          onKeyDown={handleKeyDown}
          className="w-full resize-none placeholder-purple-200 bg-purple-600 text-white py-3 px-3 rounded-3xl font-semibold transition disabled:opacity-50 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent focus:outline-none focus:ring-0 focus:border-transparent"
          placeholder="Ask anything"
          style={{ maxHeight: "200px" }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end items-center gap-1">
          {status === "idle" && (
            <button
              onClick={startRecording}
              className={`bg-purple-600 ${buttonStyle}`}
              aria-label="Start recording"
            >
              {/* <Mic size={24} /> */}
              <MicrophoneIcon className="h-8 w-8" />
            </button>
          )}

          <div className="flex items-center gap-3">
            {status === "requesting" && (
              <div className={`${buttonStyle}`}>
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
                  <StopCircleIcon className="h-8 w-8" />
                </button>
                <button
                  onClick={cancelRecording}
                  className={`bg-red-400 ${buttonStyle}`}
                  aria-label="Cancel recording"
                >
                  {/* <XMarkIcon className="h-8 w-8"/> */}
                  <XCircleIcon className="h-8 w-8" />
                </button>
              </>
            )}

            {status === "processing" && (
              <div className={` ${buttonStyle}`}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
          </div>
          {status !== "requesting" && status !== "recording" && (
            <button
              type="submit"
              disabled={loading}
              className={`bg-purple-600 ${buttonStyle} ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <LoadingSpinner size={1.5} color="purple" border={4} />
              ) : (
                <ArrowUpCircleIcon className="h-8 w-8 text-purple-200" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {(error || uploadError) && (
          <p className="text-sm text-red-500">{error || uploadError}</p>
        )}
      </div>
    </form>
  );
}

export default ChatForm;
