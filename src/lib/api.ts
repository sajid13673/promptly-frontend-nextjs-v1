import { AuthResponse } from "@/types/AuthResponse";
import { GenerateResponse } from "@/types/generateResponse";
import { RegisterFormData } from "@/types/RegisterFormData";

const token: string | null = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res: Response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function registerUser({
  name,
  email,
  password,
  confirmPassword,
}: RegisterFormData): Promise<AuthResponse> {
  const res: Response = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    }),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }
  return res.json();
}

export async function generate({
  message,
  conversationId,
}: {
  message: string;
  conversationId: number | null;
}): Promise<GenerateResponse> {
  const res: Response = await fetch("http://localhost:8000/api/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    });
    localStorage.removeItem("token");
    // window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export async function getConversations() {
  const res: Response = await fetch("http://localhost:8000/api/conversations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return res.json();
}