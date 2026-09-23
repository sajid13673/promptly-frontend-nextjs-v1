type Role = "assistant" | "user";

export type Message = {
  conversation_id: number;
  content: string;
  id: number;
  role: Role;
  created_at: string;
  updated_at: string;
};
