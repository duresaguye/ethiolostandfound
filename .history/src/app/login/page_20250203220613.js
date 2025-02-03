"use client"
import React from "react";
import { useState } from "react";
import { authClient } from "../../../lib/auth-client"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const { data, error } = await authClient.signIn.email({ 
        email, 
        password, 
      }, { 
        onRequest: (ctx) => { 
          // Show loading indicator
          console.log("Request started");
        }, 
        onSuccess: (ctx) => { 
          // Redirect to dashboard
          console.log("Sign-in successful");
          window.location.href = '/dashboard';
        }, 
        onError: (ctx) => { 
          console.error("Sign-in error:", ctx.error.message); 
          alert(ctx.error.message); 
        }, 
      });

      if (error) {
        console.error("Sign-in error:", error.message);
        alert(error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800">Login</h1>
      
      <form className="flex flex-col justify-center items-center space-y-4 bg-white p-8 shadow-lg rounded-lg w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
      </p>
    </div>
  );
}