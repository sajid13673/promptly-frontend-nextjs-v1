import { AuthResponse } from "@/types/AuthResponse";
import { GenerateResponse } from "@/types/generateResponse";
import { RegisterFormData } from "@/types/RegisterFormData";
import { TranscribeResponse } from "@/types/transcribeResponse";
import { apiFetch } from "@/utils/apiFetch";

const transcriberApiUrl = process.env.NEXT_PUBLIC_TRANSCRIBER_API_URL;

interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  passwordConfirmation: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res: Response = await apiFetch(`/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const errorMessage =
      errorData.message || errorData.error || "An unknown error occurred";

    throw new Error(errorMessage);
  }

  return res.json();
}

export async function registerUser({
  name,
  email,
  password,
  confirmPassword,
}: RegisterFormData): Promise<AuthResponse> {

  const res: Response = await apiFetch(`/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const errorMessage =
      errorData.message || errorData.error || "An unknown error occurred";

    throw new Error(errorMessage);
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
  const res: Response = await apiFetch(`/generate`, {
    method: "POST",
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function transcribe(blob: Blob): Promise<TranscribeResponse> {
  const formData = new FormData();
  const ext = blob.type.includes("mp4") ? "mp4" : "webm";
  formData.append("file", blob, `recording.${ext}`);
  const res: Response = await fetch(`${transcriberApiUrl}/transcribe`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function getCurrentUser() {
  const res = await apiFetch(`/user`, {
    method: "GET",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function logoutUser(): Promise<void> {
  try {
    const res = await apiFetch(`/logout`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw error; // let the caller decide how to handle a failed logout
  }
}

export async function getConversations() {
  const res: Response = await apiFetch(`/conversations`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return res.json();
}

export async function getConversationById(id: string) {
  const res: Response = await apiFetch(`/conversations/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new ApiError("Failed to load conversation", res.status);
  }
  return res.json();
}
export async function deleteConversationById(id: number) {
  const res: Response = await apiFetch(`/conversations/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return res.json();
}

export async function sendResetCode(email: string) {
  const res = await apiFetch(`/password/send-code`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send code");
  return data;
}

export async function verifyResetCode(email: string, code: string) {
  const res = await apiFetch(`/password/verify-code`, {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid or expired code");
  return data;
}

export async function resetPassword({
  email,
  code,
  password,
  passwordConfirmation,
}: ResetPasswordPayload) {
  const res = await apiFetch(`/password/reset`, {
    method: "POST",
    body: JSON.stringify({
      email,
      code,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
}