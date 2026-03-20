'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { DrawTool, Stroke, StrokePoint } from '@doodleshare/shared';
import { DrawingEngine } from './drawing-engine';

interface UseDrawingCanvasOptions {
  userId: string;
  canvasId: string;
  onStrokeComplete?: (stroke: Stroke) => void;
  onCursorMove?: (x: number, y: number) => void;
}

export function useDrawingCanvas(options: UseDrawingCanvasOptions) {
  const { userId, canvasId, onStrokeComplete, onCursorMove } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DrawingEngine | null>(null);
  const isDrawingRef = useRef(false);

  const [tool, setTool] = useState<DrawTool>('pen');
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(5);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    engineRef.current = new DrawingEngine(canvas);

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          engineRef.current?.resize(width, height);
        }
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
      engineRef.current.resize(parent.clientWidth, parent.clientHeight);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const engine = engineRef.current;
    if (!engine) return;

    isDrawingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const point = engine.toCanvasCoords(e.clientX, e.clientY);
    engine.startStroke(point, tool, color, width, userId, canvasId);
  }, [tool, color, width, userId, canvasId]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const engine = engineRef.current;
    if (!engine) return;

    const point = engine.toCanvasCoords(e.clientX, e.clientY);
    onCursorMove?.(point.x, point.y);

    if (!isDrawingRef.current) return;
    engine.continueStroke(point);
  }, [onCursorMove]);

  const handlePointerUp = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !isDrawingRef.current) return;

    isDrawingRef.current = false;
    const stroke = engine.endStroke();
    if (stroke) {
      // Emit completed stroke for socket broadcast
      onStrokeComplete?.(stroke);
    }
  }, [onStrokeComplete]);

  const undo = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return null;
    return engine.undo(userId);
  }, [userId]);

  const exportPNG = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    const blob = await engine.exportPNG();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doodleshare.png';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const loadSnapshot = useCallback((strokes: Stroke[]) => {
    engineRef.current?.loadSnapshot(strokes);
  }, []);

  const getEngine = useCallback(() => engineRef.current, []);

  return {
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
  };
}
