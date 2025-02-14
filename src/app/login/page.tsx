"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client"; 
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signIn = async () => {
    try {
      const { data, error } = await authClient.signIn.email(
        { email, password },
        {
          onRequest: (ctx) => {
            console.log("Request started");
          },
          onSuccess: (ctx) => {
            console.log("Sign-in successful");
            const redirectUrl =
              new URLSearchParams(window.location.search).get("redirect") ||
              "/profile";
            window.location.href = redirectUrl;
          },
          onError: (ctx) => {
            console.error("Sign-in error:", ctx.error.message);
            alert(ctx.error.message);
          },
        }
      );

      if (error) {
        console.error("Sign-in error:", error.message);
        alert(error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  interface SignInContext {
    error: {
      message: string;
    };
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    signIn();
  };

  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "facebook",
      callbackURL: "/profile",
    });
  };

  const handleLoginNavigate = () => {
    router.push("/signup");
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/profile",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300 flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h1>

        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md font-semibold py-2 rounded-md transition duration-200 hover:opacity-90"
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-3 text-gray-500 dark:text-gray-400 font-semibold">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-700 transition-colors duration-300"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 w-full transition duration-300"
          >
            Login
          </button>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={handleLoginNavigate}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 w-full transition duration-300 mt-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}