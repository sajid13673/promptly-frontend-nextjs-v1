"use client";
import { registerUser } from "@/lib/api";
import redirectIfAuthenticated from "@/lib/redirectIfAuthenticated";
import { registerSchema } from "@/schemas/auth";
import { RegisterFormData } from "@/types/RegisterFormData";
import Link from "next/link";
import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Register(): JSX.Element {
   const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const [errorMessage,setErrorMessage] = useState<string | null>(null);
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);

      await registerUser(data);
      window.location.href = "/";
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
    }
  };
  return (
    <div className="bg-white p-5 rounded-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Register
      </h2>
      {errorMessage && <p className="text-red-600 text-sm font-bold text-center">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-gray-600 text-sm mb-1">Full Name</label>
          <input
            {...register("name")}
            placeholder="Full name"
            className="w-full p-3 border text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
           {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full p-3 border text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
           {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full p-3 text-gray-500 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
           {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="w-full p-3 text-gray-500 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
           {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center uppercase w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? (
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
      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default redirectIfAuthenticated(Register);