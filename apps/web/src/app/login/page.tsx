'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { PixelCard } from '@/components/ui/pixel-card';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsGuest } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    try {
      setError(null);
      await login('user@example.com', 'ANGRYBIRD');
      router.push('/dashboard');
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  const handleGuest = async () => {
    try {
      setError(null);
      await loginAsGuest();
      router.push('/dashboard');
    } catch {
      setError('Could not connect to server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
      <PixelCard className="w-full max-w-md flex flex-col gap-10 p-12">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-4xl font-black tracking-tight">WELCOME BACK!</h2>
          <p className="font-bold text-sm opacity-40 uppercase tracking-widest">Choose your way to play</p>
        </div>

        {error && (
          <p className="text-red-500 font-black text-sm text-center bg-red-50 border-2 border-red-300 rounded-xl p-3">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogle}
            className="cm-button w-full py-4 flex items-center justify-center gap-4 bg-white"
          >
            <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" referrerPolicy="no-referrer" />
            CONTINUE WITH GOOGLE
          </button>

          <button
            onClick={handleGuest}
            className="cm-button w-full py-4 flex items-center justify-center gap-4 bg-cm-blue text-black"
          >
            CONTINUE AS GUEST
          </button>
        </div>

        <Link href="/" className="font-black underline text-xs opacity-30 hover:opacity-100 transition-opacity uppercase tracking-widest text-center">
          GO BACK TO HOME
        </Link>
      </PixelCard>
    </div>
  );
}
