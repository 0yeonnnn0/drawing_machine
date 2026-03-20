'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { PixelCard } from '@/components/ui/pixel-card';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsGuest } = useAuth();

  const handleGoogle = async () => {
    // TODO: real Google OAuth
    await login('user@example.com', 'ANGRYBIRD');
    router.push('/dashboard');
  };

  const handleGuest = async () => {
    await loginAsGuest();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
      <PixelCard className="w-full max-w-md flex flex-col gap-10 p-12">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-4xl font-black tracking-tight">WELCOME BACK!</h2>
          <p className="font-bold text-sm opacity-40 uppercase tracking-widest">Choose your way to play</p>
        </div>

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
