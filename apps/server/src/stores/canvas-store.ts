import type { Canvas, Stroke } from '@doodleshare/shared';
import { v4 as uuid } from 'uuid';

const canvases = new Map<string, Canvas>();

export const canvasStore = {
  create(ownerId: string, title: string): Canvas {
    const canvas: Canvas = {
      id: uuid(),
      owner_id: ownerId,
      title,
      share_token: uuid(),
      snapshot: [],
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    canvases.set(canvas.id, canvas);
    return canvas;
  },

  get(id: string): Canvas | undefined {
    return canvases.get(id);
  },

  getByOwner(ownerId: string): Canvas[] {
    return [...canvases.values()].filter(c => c.owner_id === ownerId);
  },

  getByShareToken(token: string): Canvas | undefined {
    return [...canvases.values()].find(c => c.share_token === token);
  },

  update(id: string, data: Partial<Pick<Canvas, 'title' | 'is_public'>>): Canvas | undefined {
    const canvas = canvases.get(id);
    if (!canvas) return undefined;
    Object.assign(canvas, data, { updated_at: new Date().toISOString() });
    return canvas;
  },

  updateSnapshot(id: string, strokes: Stroke[]): void {
    const canvas = canvases.get(id);
    if (canvas) {
      canvas.snapshot.push(...strokes);
      canvas.updated_at = new Date().toISOString();
    }
  },

  delete(id: string): boolean {
    return canvases.delete(id);
  },
};
