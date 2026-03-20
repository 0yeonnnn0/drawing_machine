import type { Stroke } from '@doodleshare/shared';
import { canvasStore } from './canvas-store.js';

// canvasId -> buffered strokes (mimics Redis lpush)
const buffer = new Map<string, Stroke[]>();

export const strokeBuffer = {
  push(canvasId: string, stroke: Stroke): void {
    if (!buffer.has(canvasId)) {
      buffer.set(canvasId, []);
    }
    buffer.get(canvasId)!.push(stroke);
  },

  flush(canvasId: string): Stroke[] {
    const strokes = buffer.get(canvasId) || [];
    buffer.set(canvasId, []);
    return strokes;
  },

  /** Flush all canvas buffers and merge into snapshots */
  flushAll(): void {
    for (const [canvasId, strokes] of buffer.entries()) {
      if (strokes.length > 0) {
        canvasStore.updateSnapshot(canvasId, strokes);
        buffer.set(canvasId, []);
      }
    }
  },
};

// 30-second flush interval
let flushInterval: ReturnType<typeof setInterval> | null = null;

export function startFlushJob(): void {
  flushInterval = setInterval(() => {
    strokeBuffer.flushAll();
  }, 30_000);
}

export function stopFlushJob(): void {
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }
}
