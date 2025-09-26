import { Message } from "./Message";

type Role = "CHATBOT" | "USER";

export type Conversation = {
  id: number;
  user_id: number;
  role: Role;
  created_at: string;
  updated_at: string;
  messages?: [Message]
};
