import React from "react";

export default function SignupPage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
            <h1 className="text-4xl font-semibold text-gray-800">Sign Up</h1>
            
            <form className="flex flex-col justify-center items-center space-y-4 bg-white p-8 shadow-lg rounded-lg w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all"
                >
                    Sign Up
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
            </p>
        </div>
    );
}
