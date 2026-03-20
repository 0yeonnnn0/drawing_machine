'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Share2, Trash2, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { Canvas } from '@doodleshare/shared';
import { useAuth } from '@/lib/auth/auth-context';
import { canvasApi } from '@/lib/api/canvas-api';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';

const CARD_COLORS = ['bg-cm-yellow', 'bg-cm-pink', 'bg-cm-blue', 'bg-cm-green', 'bg-cm-orange', 'bg-cm-purple'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isGuest, isLoading, logout } = useAuth();
  const [canvases, setCanvases] = useState<Canvas[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      canvasApi.list().then(setCanvases).catch(() => {});
    }
  }, [user, isLoading, router]);

  const handleCreate = async () => {
    const canvas = await canvasApi.create('Untitled Room');
    router.push(`/canvas/${canvas.id}`);
  };

  const handleDelete = async (id: string) => {
    await canvasApi.delete(id);
    setCanvases(prev => prev.filter(c => c.id !== id));
  };

  const handleShare = async (canvas: Canvas) => {
    const url = `${window.location.origin}/join/${canvas.share_token}`;
    await navigator.clipboard.writeText(url);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <header className="p-4 bg-white border-b-3 border-black flex justify-between items-center px-8">
        <Link href="/" className="font-black text-2xl tracking-tighter">DOODLESHARE</Link>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-3 font-black text-sm">
            <div className={`w-10 h-10 rounded-full border-3 border-black shadow-[2px_2px_0px_black] ${isGuest ? 'bg-gray-200' : 'bg-cm-pink'}`}></div>
            <div className="flex flex-col">
              <span className="leading-none">{user.username}</span>
              <span className="text-[10px] opacity-40">LEVEL 1</span>
            </div>
          </div>
          <PixelButton onClick={handleLogout} className="p-2 shadow-[2px_2px_0px_black]"><LogOut size={18} /></PixelButton>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">MY ROOMS</h1>
            <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Manage your collaborative drawing spaces</p>
          </div>
          <PixelButton onClick={handleCreate} variant="primary" className="py-4 px-8 text-lg">
            <Plus size={24} /> CREATE NEW ROOM
          </PixelButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {canvases.map((canvas, i) => (
            <motion.div key={canvas.id} whileHover={{ y: -5 }} className="group">
              <PixelCard className="p-0 overflow-hidden flex flex-col h-full border-3 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <Link
                  href={`/canvas/${canvas.id}`}
                  className={`h-40 ${CARD_COLORS[i % CARD_COLORS.length]} border-b-3 border-black flex items-center justify-center cursor-pointer relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <ImageIcon size={48} className="opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-300" />
                </Link>
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl uppercase truncate max-w-[200px]">{canvas.title}</h3>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">
                        {new Date(canvas.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-2 bg-black/5 rounded-lg border-2 border-black/10">
                      {canvas.is_public ? <Unlock size={16} className="opacity-40" /> : <Lock size={16} className="opacity-40" />}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/canvas/${canvas.id}`} className="flex-1">
                      <PixelButton className="w-full text-xs py-2 shadow-[2px_2px_0px_black]">ENTER ROOM</PixelButton>
                    </Link>
                    <PixelButton onClick={() => handleShare(canvas)} className="text-xs py-2 px-3 shadow-[2px_2px_0px_black]"><Share2 size={14} /></PixelButton>
                    <PixelButton onClick={() => handleDelete(canvas.id)} className="text-xs py-2 px-3 shadow-[2px_2px_0px_black] text-red-500"><Trash2 size={14} /></PixelButton>
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>

        {canvases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-40">
            <ImageIcon size={64} />
            <p className="font-black text-xl uppercase">No rooms yet</p>
            <p className="font-bold text-sm">Create your first room to start drawing!</p>
          </div>
        )}
      </main>
    </div>
  );
}
