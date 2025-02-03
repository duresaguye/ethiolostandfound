"use client"
import { authClient } from "../../../lib/auth-client"; 
import { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const signUp = async () => {
    
    const { data, error } = await authClient.signUp.email({ 
        email, 
        password, 
        name, 
        image: image ? convertImageToBase64(image) : undefined, 
     }, { 
        onRequest: (ctx) => { 
         // Show loading indicator
        }, 
        onSuccess: (ctx) => { 
            // Redirect to dashboard
            window.location.href = '/dashboard';
        }, 
        onError: (ctx) => { 
          alert(ctx.error.message); 
        }, 
      }); 
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800">Sign Up</h1>
      
      <form className="flex flex-col justify-center items-center space-y-4 bg-white p-8 shadow-lg rounded-lg w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); signUp(); }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
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

// Helper function to convert image to base64
function convertImageToBase64(file) {
  // Implementation of the function
  return '';
}