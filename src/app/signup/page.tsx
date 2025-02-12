"use client";
import React, { useState, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "../../../lib/auth-client"; 
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from 'react-icons/fa';
import Loader from '../../components/Loader';

// Inline Spinner Component
const InlineSpinner = ({ className }: { className?: string }) => (
  <FaSpinner className={`animate-spin ${className}`} />
);

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      setError('');
    }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.username,
      }, {
        onSuccess: () => router.push('/profile'),
        onError: (ctx) => setError(ctx.error.message),
      });

      if (authError) setError(authError.message || "An unknown error occurred");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  const signInWithGoogle = useCallback(async () => {
    setSocialLoading(true);
    setError('');
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error("Google sign-in error:", err);
    } finally {
      setSocialLoading(false);
    }
  }, []);

  const handleLoginNavigate = useCallback(() => {
    router.push('/login');
  }, [router]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center transition-colors duration-300">
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Sign Up</h1>
        
        <button
          onClick={signInWithGoogle}
          disabled={socialLoading}
          className="flex items-center justify-center w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold py-2 rounded-md shadow-lg transition duration-200 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {socialLoading ? (
            <InlineSpinner className="text-gray-500 mr-2 text-xl" />
          ) : (
            <>
              <FcGoogle className="text-2xl mr-2" />
              Sign up with Google
            </>
          )}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-3 text-gray-500 dark:text-gray-400 font-semibold">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleInputChange('username')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your Full Name"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 w-full transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <InlineSpinner className="text-white text-xl mr-2" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
            Already have an account?
          </p>
          
          <button
            type="button"
            onClick={handleLoginNavigate}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 w-full transition duration-300 mt-2"
            disabled={loading}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;