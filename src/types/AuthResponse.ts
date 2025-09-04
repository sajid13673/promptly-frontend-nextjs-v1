import { User } from "./User";

export type AuthResponse = {
  token: string;
  status: boolean;
  user: User;
};