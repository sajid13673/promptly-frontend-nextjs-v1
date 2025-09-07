"use client";
import { JSX, useState } from "react";
import { loginUser } from "@/lib/api";
import { AuthResponse } from "@/types/AuthResponse";
import Link from "next/link";



export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data: AuthResponse = await loginUser(email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      window.location.href = "/chat";
    } catch (err) {
      console.log("err : ", err);

      setError("Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Welcome Back 👋
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-gray-500 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        Don’t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
