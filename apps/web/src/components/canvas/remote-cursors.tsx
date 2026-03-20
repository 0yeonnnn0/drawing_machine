'use client';

interface CursorInfo {
  userId: string;
  x: number;
  y: number;
  nickname: string;
  color: string;
}

interface RemoteCursorsProps {
  cursors: Map<string, CursorInfo>;
}

export function RemoteCursors({ cursors }: RemoteCursorsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from(cursors.values()).map(cursor => (
        <div
          key={cursor.userId}
          className="absolute flex flex-col items-start gap-1 transition-all duration-75"
          style={{ left: cursor.x, top: cursor.y }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-black"
            style={{ backgroundColor: cursor.color }}
          />
          <div className="bg-black text-white text-[10px] px-2 py-0.5 font-black rounded-full whitespace-nowrap">
            {cursor.nickname}
          </div>
        </div>
      ))}
    </div>
  );
}
