type Role = "CHATBOT" | "USER";

export type Message = {
  conversation_id: number;
  message: string;
  id: number;
  role: Role;
  created_at: string;
  updated_at: string;
};
