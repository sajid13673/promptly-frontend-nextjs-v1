// hooks/useSpeechSynthesis.ts
"use client";
import { useState, useCallback, useEffect } from "react";

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(({ text, lang }: { text: string; lang?: string }) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // stop anything already playing

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) utterance.lang = lang;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  // stop speech when the component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, cancel, speaking };
}