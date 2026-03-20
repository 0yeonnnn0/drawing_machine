'use client';

import type { DrawTool, Stroke, StrokePoint } from '@doodleshare/shared';
import { useDrawingCanvas } from '@/lib/canvas/use-drawing-canvas';

interface DrawingCanvasProps {
  userId: string;
  canvasId: string;
  onStrokeStart?: (stroke: Stroke) => void;
  onStrokeContinue?: (strokeId: string, points: StrokePoint[]) => void;
  onStrokeEnd?: (strokeId: string) => void;
  onCursorMove?: (x: number, y: number) => void;
  tool: DrawTool;
  color: string;
  width: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
}

export function DrawingCanvas({
  canvasRef,
  tool,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: DrawingCanvasProps) {
  const cursorClass = tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair';

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${cursorClass}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
