import { Conversation } from "./Conversation";

export type GenerateResponse = {
  status: boolean;
  message: string;
  reply: string;
  conversation: Conversation;
};
