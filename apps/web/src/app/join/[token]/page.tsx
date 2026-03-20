'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateNickname } from '@doodleshare/shared';
import { useAuth } from '@/lib/auth/auth-context';
import { canvasApi } from '@/lib/api/canvas-api';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';
import { PixelInput } from '@/components/ui/pixel-input';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { user, loginAsGuest } = useAuth();

  const [nickname, setNickname] = useState(() => generateNickname());
  const [canvasInfo, setCanvasInfo] = useState<{ id: string; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    canvasApi.getByToken(token)
      .then(info => {
        setCanvasInfo(info);
        setLoading(false);
      })
      .catch(() => {
        setError('Invalid or expired invite link');
        setLoading(false);
      });
  }, [token]);

  const handleJoin = async () => {
    if (!canvasInfo) return;

    // If not logged in, create guest session first
    if (!user) {
      await loginAsGuest();
    }

    await canvasApi.join(canvasInfo.id, nickname);
    router.push(`/canvas/${canvasInfo.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <p className="font-black text-xl animate-pixel-blink">LOADING...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
        <PixelCard className="w-full max-w-md flex flex-col gap-8 p-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight text-red-500">OOPS!</h2>
          <p className="font-bold opacity-60">{error}</p>
          <Link href="/" className="cm-button cm-button-primary self-center">GO HOME</Link>
        </PixelCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
      <PixelCard className="w-full max-w-md flex flex-col gap-10 p-12 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">JOIN ROOM</h2>
          <div className="px-4 py-1 bg-cm-yellow border-2 border-black rounded-full self-center">
            <p className="text-xs font-black italic">&quot;{canvasInfo?.title}&quot;</p>
          </div>
        </div>

        {!user && (
          <div className="flex flex-col gap-4 text-left">
            <label className="font-black text-xs uppercase tracking-widest opacity-40 ml-1">YOUR NICKNAME</label>
            <PixelInput
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-xl font-black py-4"
            />
          </div>
        )}

        <PixelButton onClick={handleJoin} variant="primary" className="py-4 text-xl">
          JOIN NOW
        </PixelButton>

        <Link href="/" className="font-black opacity-30 hover:opacity-100 underline text-xs transition-opacity uppercase tracking-widest">
          CANCEL
        </Link>
      </PixelCard>
    </div>
  );
}
