'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Menu, Users, Lock, Unlock, Share2, Download, Undo2,
  Pencil, Eraser, Type, Image as ImageIcon,
} from 'lucide-react';
import type { DrawTool, Canvas } from '@doodleshare/shared';
import { PALETTE_COLORS } from '@doodleshare/shared';
import { useAuth } from '@/lib/auth/auth-context';
import { canvasApi } from '@/lib/api/canvas-api';
import { useDrawingCanvas } from '@/lib/canvas/use-drawing-canvas';
import { useCanvasSocket } from '@/lib/socket/use-canvas-socket';
import { PixelButton } from '@/components/ui/pixel-button';
import { DrawingCanvas } from '@/components/canvas/drawing-canvas';
import { WidthSelector } from '@/components/canvas/width-selector';
import { RemoteCursors } from '@/components/canvas/remote-cursors';
import { ConnectionStatus } from '@/components/canvas/connection-status';
import { ToastContainer, useToast } from '@/components/ui/toast';

const TOOLS: { id: DrawTool; icon: React.ReactNode; color: string }[] = [
  { id: 'pen', icon: <Pencil size={20} />, color: 'bg-cm-yellow' },
  { id: 'eraser', icon: <Eraser size={20} />, color: 'bg-cm-blue' },
  { id: 'text', icon: <Type size={20} />, color: 'bg-cm-green' },
  { id: 'image', icon: <ImageIcon size={20} />, color: 'bg-cm-pink' },
];

export default function CanvasPage() {
  const params = useParams();
  const router = useRouter();
  const canvasId = params.id as string;
  const { user } = useAuth();
  const { toasts, addToast } = useToast();

  const [canvasData, setCanvasData] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const userId = user?.id || 'anonymous';
  const nickname = user?.username || 'Anonymous';

  const {
    canvasRef,
    tool, setTool,
    color, setColor,
    width, setWidth,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    undo,
    exportPNG,
    loadSnapshot,
    getEngine,
  } = useDrawingCanvas({
    userId,
    canvasId,
    onCursorMove: (x, y) => emitCursorMove(x, y),
    onStrokeStart: (stroke) => emitStroke(stroke),
  });

  const {
    participants,
    remoteCursors,
    connectionStatus,
    emitStroke,
    emitCursorMove,
    emitUndo,
  } = useCanvasSocket({
    canvasId,
    userId,
    nickname,
    getEngine,
  });

  // Fetch canvas data
  useEffect(() => {
    canvasApi.get(canvasId).then(canvas => {
      setCanvasData(canvas);
      setTitle(canvas.title);
      setIsPublic(canvas.is_public);
      setIsOwner(canvas.owner_id === userId);
      if (canvas.snapshot.length > 0) {
        loadSnapshot(canvas.snapshot);
      }
    }).catch(() => {
      router.push('/dashboard');
    });
  }, [canvasId, userId, loadSnapshot, router]);

  const handleUndo = () => {
    undo();
    emitUndo();
  };

  const handleTogglePublic = async () => {
    if (!isOwner) return;
    const next = !isPublic;
    setIsPublic(next);
    await canvasApi.update(canvasId, { is_public: next });
  };

  const handleShare = async () => {
    if (!canvasData) return;
    const url = `${window.location.origin}/join/${canvasData.share_token}`;
    await navigator.clipboard.writeText(url);
    addToast('Link copied to clipboard!');
  };

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isOwner || e.target.value === title) return;
    setTitle(e.target.value);
    await canvasApi.update(canvasId, { title: e.target.value });
  };

  const onlineParticipants = participants.filter(p => p.is_online);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f0f4f8] font-sans">
      <ConnectionStatus status={connectionStatus} />
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <header className="h-16 bg-white border-b-3 border-black flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="cm-button p-2 shadow-[2px_2px_0px_black]">
            <Menu size={20} />
          </button>
          <div className="flex flex-col">
            <input
              defaultValue={title}
              onBlur={handleTitleBlur}
              readOnly={!isOwner}
              className="bg-transparent font-black uppercase text-lg outline-none border-b-2 border-transparent focus:border-black"
            />
            <div className="flex items-center gap-2 text-[10px] font-black opacity-40">
              <Users size={10} /> {onlineParticipants.length} PLAYER{onlineParticipants.length !== 1 ? 'S' : ''} &bull; {isPublic ? 'PUBLIC ROOM' : 'PRIVATE ROOM'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onlineParticipants.length > 0 && (
            <div className="hidden lg:flex items-center gap-2 mr-4">
              <div className="flex -space-x-2">
                {onlineParticipants.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: p.cursor_color }}
                    title={p.nickname}
                  >
                    {p.nickname[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
              {onlineParticipants.length > 3 && (
                <span className="text-xs font-black opacity-40">+{onlineParticipants.length - 3} OTHERS</span>
              )}
            </div>
          )}
          {isOwner && (
            <PixelButton className="p-2 shadow-[2px_2px_0px_black]" onClick={handleTogglePublic}>
              {isPublic ? <Unlock size={18} /> : <Lock size={18} />}
            </PixelButton>
          )}
          <PixelButton className="p-2 shadow-[2px_2px_0px_black]" variant="blue" onClick={handleShare}>
            <Share2 size={18} />
          </PixelButton>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden p-4 gap-4">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col gap-4 relative">
          <main className="flex-1 cm-panel bg-white overflow-hidden relative shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
            <DrawingCanvas
              userId={userId}
              canvasId={canvasId}
              tool={tool}
              color={color}
              width={width}
              canvasRef={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
            <RemoteCursors cursors={remoteCursors} />
          </main>

          {/* Floating Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div className="cm-toolbar flex items-center gap-2">
              <div className="flex items-center gap-1.5 pr-4 border-r-2 border-black/10">
                {TOOLS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black transition-all ${
                      tool === t.id ? t.color + ' shadow-[2px_2px_0px_black] -translate-y-1' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 px-2">
                {PALETTE_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 border-black transition-transform hover:scale-110 ${
                      color === c ? 'scale-125 z-10' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="px-2 border-l-2 border-black/10">
                <WidthSelector value={width} onChange={setWidth} />
              </div>

              <div className="flex items-center gap-2 pl-2 border-l-2 border-black/10">
                <button
                  onClick={handleUndo}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-gray-50"
                >
                  <Undo2 size={20} />
                </button>
                <button
                  onClick={exportPNG}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black bg-cm-orange text-black shadow-[2px_2px_0px_black]"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden md:flex w-72 flex-col gap-4">
          <div className="flex-1 cm-panel flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
            <div className="p-4 bg-cm-yellow border-b-3 border-black font-black text-sm flex justify-between items-center">
              <span>PLAYERS ({onlineParticipants.length})</span>
              <Users size={16} />
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {onlineParticipants.map(p => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-xl border-2 border-black ${
                    p.user_id === userId ? 'bg-white' : 'bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-black"
                      style={{ backgroundColor: p.cursor_color }}
                    />
                    <span className="font-black text-xs">
                      {p.nickname}{p.user_id === userId ? ' (YOU)' : ''}
                    </span>
                  </div>
                  <span className="font-black text-[10px] opacity-40 uppercase">{p.role}</span>
                </div>
              ))}
              {onlineParticipants.length === 0 && (
                <p className="text-xs font-bold opacity-30 text-center py-4">Connecting...</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
