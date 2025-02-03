import React from 'react';
import { auth } from "../../lib/auth";
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    async function fetchSession() {
      const session = await auth.api.getSession({
        headers: await headers()
      });
      setSession(session);
    }
    fetchSession();
  }, []);

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut({
        headers: await headers()
      });
      router.push('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <Link href="/">Logo</Link>
      </div>
      <div className="space-x-4">
        {session ? (
          <Button onClick={handleSignOut}>Logout</Button>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}