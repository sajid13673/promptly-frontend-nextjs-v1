declare module "react-speech-kit" {
  export interface SpeakArgs {
    text: string;
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
  }

  export interface SpeechSynthesisHook {
    speak: (args: SpeakArgs) => void;
    cancel: () => void;
    speaking: boolean;
    supported: boolean;
    voices: SpeechSynthesisVoice[];
  }

  export function useSpeechSynthesis(): SpeechSynthesisHook;
}