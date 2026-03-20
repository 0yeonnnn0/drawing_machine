'use client';

import Link from 'next/link';
import { Pencil, Users, Share2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth/auth-context';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <nav className="p-6 flex justify-between items-center bg-white border-b-3 border-black">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-cm-yellow border-3 border-black rounded-xl flex items-center justify-center text-black shadow-[2px_2px_0px_black]">D</div>
          DOODLESHARE
        </div>
        {user ? (
          <Link href="/dashboard">
            <PixelButton variant="primary">MY ROOMS</PixelButton>
          </Link>
        ) : (
          <Link href="/login">
            <PixelButton>LOGIN</PixelButton>
          </Link>
        )}
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-16 relative overflow-hidden">
        <div className="absolute top-20 left-[10%] w-20 h-20 bg-cm-pink/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-32 h-32 bg-cm-blue/20 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'circOut' }}
          className="max-w-4xl flex flex-col gap-10 z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            DRAW TOGETHER,<br />
            <span className="text-cm-blue drop-shadow-[4px_4px_0px_black]">EVERY PIXEL COUNTS.</span>
          </h1>
          <p className="text-xl font-bold opacity-60 max-w-2xl mx-auto leading-relaxed">
            The ultimate collaborative drawing game.
            Create a room, invite your friends, and start doodling in real-time.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-4">
            <Link href="/dashboard">
              <PixelButton className="text-xl py-4 px-10" variant="primary">
                START DRAWING <ChevronRight size={28} />
              </PixelButton>
            </Link>
            <Link href="/join/demo">
              <PixelButton className="text-xl py-4 px-10">
                JOIN ROOM
              </PixelButton>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
          {[
            { icon: <Pencil size={24} />, title: 'PLAYFUL TOOLS', desc: 'Fun and easy-to-use tools designed for creativity.', color: 'bg-cm-yellow' },
            { icon: <Users size={24} />, title: 'MULTIPLAYER', desc: 'Draw with up to 16 friends in the same room.', color: 'bg-cm-blue' },
            { icon: <Share2 size={24} />, title: 'INSTANT SHARE', desc: 'Share your room link and start playing immediately.', color: 'bg-cm-green' },
          ].map((feat, i) => (
            <PixelCard key={i} className="flex flex-col items-center gap-6 text-center p-8 hover:translate-y-[-8px] transition-transform cursor-default">
              <div className={`p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_black] ${feat.color}`}>{feat.icon}</div>
              <h3 className="font-black text-xl uppercase tracking-tight">{feat.title}</h3>
              <p className="text-sm font-bold opacity-50 leading-relaxed">{feat.desc}</p>
            </PixelCard>
          ))}
        </div>
      </main>

      <footer className="p-8 border-t-3 border-black bg-white text-center font-black text-xs opacity-30 tracking-widest">
        &copy; 2026 DOODLESHARE &bull; MADE WITH JOY
      </footer>
    </div>
  );
}
