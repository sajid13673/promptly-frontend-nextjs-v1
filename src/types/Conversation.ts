import { Message } from "./Message";

export type Conversation = {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: [Message];
};
