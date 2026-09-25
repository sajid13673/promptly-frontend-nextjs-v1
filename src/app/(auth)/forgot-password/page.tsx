"use client";

import { useState } from "react";
import { sendResetCode, verifyResetCode, resetPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // 'email' | 'code' | 'password' | 'done'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e?: React.SyntheticEvent) => {
    e?.preventDefault(); 
    setError("");
    setLoading(true);
    try {
      await sendResetCode(email);
      setStep("code");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyResetCode(email, code);
      setStep("password");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, code, password, passwordConfirmation });
      setStep("done");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg bg-white">
      <h1 className="text-xl text-gray-700 font-semibold mb-4">Reset your password</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {step === "email" && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <p className="text-sm text-gray-600">
            {`Enter your email and we'll send you a code.`}
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-gray-700"
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2"
          >
            {loading ? "Sending..." : "Send code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to {email}.
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            className="w-full border rounded px-3 py-2 text-center tracking-widest text-gray-600"
          />
          <button
            disabled={loading}
            className="w-full bg-black text-white rounded py-2"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
          <button
            type="button"
            onClick={handleSendCode}
            className="w-full text-sm bg-blue-600 text-gray-100 p-1.5"
          >
            Resend code
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border rounded px-3 py-2 text-gray-600"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={8}
            className="w-full border rounded px-3 py-2 text-gray-600"
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="text-center space-y-2">
          <p className="text-green-600 font-medium">
            Password reset successfully!
          </p>
          <a href="/login" className="text-sm underline">
            Back to login
          </a>
        </div>
      )}
    </div>
  );
}
