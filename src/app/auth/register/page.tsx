"use client";
import { registerUser } from "@/lib/api";
import { AuthResponse } from "@/types/AuthResponse";
import { RegisterFormData } from "@/types/RegisterFormData";
import { JSX, useState } from "react";

export default function Register(): JSX.Element {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log("formData", formData);

      const data: AuthResponse = await registerUser(formData);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      window.location.href = "/chat";
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="bg-white p-5 rounded-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center ">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-600 text-sm mb-1">Full Name</label>
          <input
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleOnChange}
            className="w-full p-3 border text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleOnChange}
            className="w-full p-3 border text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleOnChange}
            className="w-full p-3 text-gray-500 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleOnChange}
            className="w-full p-3 text-gray-500 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center uppercase w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="mx-auto flex gap-3">
              <span>registering </span>
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                ></path>
              </svg>
            </div>
          ) : (
            <span className="mx-auto">register</span>
          )}
        </button>
      </form>
    </div>
  );
}
