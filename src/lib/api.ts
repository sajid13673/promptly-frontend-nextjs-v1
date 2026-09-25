import { AuthResponse } from "@/types/AuthResponse";
import { GenerateResponse } from "@/types/generateResponse";
import { RegisterFormData } from "@/types/RegisterFormData";
import { TranscribeResponse } from "@/types/transcribeResponse";

const token: string | null =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const transcriberApiUrl = process.env.NEXT_PUBLIC_TRANSCRIBER_API_URL;
  console.log('utl', apiUrl);
  
interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  passwordConfirmation: string;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res: Response = await fetch(`${apiUrl}/login`, {
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
  const res: Response = await fetch(`${apiUrl}/register`, {
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
  const res: Response = await fetch(`${apiUrl}/generate`, {
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

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${apiUrl}/logout`, {
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
  const res: Response = await fetch(`${apiUrl}/conversations`, {
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

export async function getConversationById(id: string) {
  const res: Response = await fetch(
    `${apiUrl}/conversations/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return res.json();
}
export async function deleteConversationById(id: number) {
  const res: Response = await fetch(
    `${apiUrl}/conversations/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return res.json();
}

export async function sendResetCode(email: string) {
  const res = await fetch(`${apiUrl}/password/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send code');
  return data;
}

export async function verifyResetCode(email: string, code: string) {
  const res = await fetch(`${apiUrl}/password/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid or expired code');
  return data;
}

export async function resetPassword({email, code, password, passwordConfirmation}: ResetPasswordPayload) {
  const res = await fetch(`${apiUrl}/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      code,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reset password');
  return data;
}