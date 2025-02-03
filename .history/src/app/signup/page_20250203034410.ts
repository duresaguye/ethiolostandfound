"use client"
import { authClient } from "../../../lib/auth-client"; 
import { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email({ 
        email, 
        password, 
        name, 
        image: image ? convertImageToBase64(image) : undefined, 
     }, { 
        onRequest: (ctx: any) => { 
         // Show loading indicator
        }, 
        onSuccess: (ctx: any) => { 
            // Redirect to dashboard
            window.location.href = '/dashboard';
        }, 
        onError: (ctx: any) => { 
          alert(ctx.error.message); 
        }, 
      }); 
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <form onSubmit={(e) => { e.preventDefault(); signUp(); }}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
        />
        <input 
          type="file" 
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} 
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

// Helper function to convert image to base64
function convertImageToBase64(file: File): string {
  // Implementation of the function
  return '';
}