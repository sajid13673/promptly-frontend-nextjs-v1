"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseVoiceRecorderOptions {
  silenceThreshold?: number; // volume level below which is considered "silence" (0-255)
  silenceDuration?: number; // ms of continuous silence before auto-stop
  maxDuration?: number; // hard cap in ms, safety net
  minRecordingDuration?: number; // ignore silence detection for this long at the start
  onRecordingComplete?: (blob: Blob) => void;
}

type RecorderStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "error";

export function useVoiceRecorder({
  silenceThreshold = 15,
  silenceDuration = 1500,
  maxDuration = 60_000,
  minRecordingDuration = 500,
  onRecordingComplete,
}: UseVoiceRecorderOptions = {}) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0); // 0-100, handy for a live meter UI

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const recordingStartRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
    rafRef.current = null;
    maxTimerRef.current = null;
    silenceStartRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop(); // triggers 'onstop' below, which does cleanup + callback
    }
  }, []);

  // Analyses the mic stream frame-by-frame, watches for sustained silence
  const monitorSilence = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);

      // average volume across frequency bins
      const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
      setVolume(Math.min(100, Math.round((avg / 255) * 100 * 3))); // scaled for UI responsiveness

      const elapsed = Date.now() - recordingStartRef.current;

      if (elapsed > minRecordingDuration) {
        if (avg < silenceThreshold) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = Date.now();
          } else if (Date.now() - silenceStartRef.current >= silenceDuration) {
            stopRecording();
            return; // stop the loop
          }
        } else {
          silenceStartRef.current = null; // reset on any real sound
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [silenceThreshold, silenceDuration, minRecordingDuration, stopRecording]);

  const startRecording = useCallback(async () => {
    setError(null);
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Pick a mimeType the browser actually supports
      const mimeType =
        ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((t) =>
          MediaRecorder.isTypeSupported(t),
        ) ?? "";

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        setStatus("processing");
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        cleanup();
        setStatus("idle");
        onRecordingComplete?.(blob);
      };

      recorder.onerror = (e) => {
        console.error("MediaRecorder error", e);
        setError("Recording failed");
        setStatus("error");
        cleanup();
      };

      // Web Audio setup for silence detection
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      recordingStartRef.current = Date.now();
      recorder.start(250); // collect chunks every 250ms
      setStatus("recording");

      monitorSilence();

      maxTimerRef.current = setTimeout(() => {
        stopRecording();
      }, maxDuration);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone permission denied"
          : "Could not access microphone",
      );
      setStatus("error");
      cleanup();
    }
  }, [
    cleanup,
    monitorSilence,
    stopRecording,
    maxDuration,
    onRecordingComplete,
  ]);

  const cancelRecording = useCallback(() => {
    chunksRef.current = [];
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.onstop = null; // suppress the normal completion flow
      mediaRecorderRef.current.stop();
    }
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  useEffect(() => () => cleanup(), [cleanup]); // safety net on unmount

  return {
    status,
    error,
    volume,
    startRecording,
    stopRecording,
    cancelRecording,
    analyserRef,
  };
}
