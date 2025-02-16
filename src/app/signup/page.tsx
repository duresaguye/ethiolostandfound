"use client";
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "../../../lib/auth-client"; 
import { FcGoogle } from "react-icons/fc";

const Signup: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: username,
      }, {
        onRequest: (ctx) => {
          // Show loading indicator
        },
        onSuccess: (ctx) => {
          router.push('/profile');
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      });

      if (error) {
        setError(error?.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleLoginNavigate = () => {
    router.push('/login');
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/profile",
    });
  };

  return (
    <div className="min-h-screen  p-8 flex items-center justify-center ">
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center ">Sign Up</h1>
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold py-2 rounded-md shadow-lg transition duration-200 hover:opacity-90"
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign up with Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-3
           text-gray-500 dark:text-gray-400 font-semibold">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your Full Name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Email</label>
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
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 mt-4 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 w-full transition duration-300"
          >
            Sign Up
          </button>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">Already have an account?</p>
          <button
            type="button"
            onClick={handleLoginNavigate}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 w-full transition duration-300 mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;