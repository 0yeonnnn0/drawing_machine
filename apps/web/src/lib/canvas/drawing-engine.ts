import type { Stroke, StrokePoint, DrawTool } from '@doodleshare/shared';
import { v4 as uuid } from 'uuid';

export class DrawingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private strokes: Stroke[] = [];
  private currentStroke: Stroke | null = null;
  private dpr: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;
  }

  /** Resize canvas to fill container, accounting for DPR */
  resize(width: number, height: number): void {
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(this.dpr, this.dpr);
    this.render();
  }

  /** Convert page coordinates to canvas coordinates */
  toCanvasCoords(clientX: number, clientY: number): StrokePoint {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  /** Begin a new stroke */
  startStroke(point: StrokePoint, tool: DrawTool, color: string, width: number, userId: string, canvasId: string): void {
    this.currentStroke = {
      id: uuid(),
      canvas_id: canvasId,
      user_id: userId,
      path_data: [point],
      color,
      width,
      tool,
      created_at: new Date().toISOString(),
    };

    // Draw first dot
    this.ctx.save();
    this.applyStrokeStyle(this.currentStroke);
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  /** Continue the current stroke */
  continueStroke(point: StrokePoint): StrokePoint[] | null {
    if (!this.currentStroke) return null;
    this.currentStroke.path_data.push(point);

    const points = this.currentStroke.path_data;
    const len = points.length;

    // Draw incremental segment
    this.ctx.save();
    this.applyStrokeStyle(this.currentStroke);
    this.ctx.beginPath();
    this.ctx.moveTo(points[len - 2].x, points[len - 2].y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
    this.ctx.restore();

    return [point];
  }

  /** Finalize the current stroke */
  endStroke(): Stroke | null {
    if (!this.currentStroke) return null;
    const stroke = this.currentStroke;
    this.strokes.push(stroke);
    this.currentStroke = null;
    return stroke;
  }

  /** Add a remote stroke (already completed) */
  addRemoteStroke(stroke: Stroke): void {
    this.strokes.push(stroke);
    this.drawStroke(stroke);
  }

  /** Undo the last stroke by a given user */
  undo(userId: string): string | null {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.strokes[i].user_id === userId) {
        const removed = this.strokes.splice(i, 1)[0];
        this.render();
        return removed.id;
      }
    }
    return null;
  }

  /** Remove a specific stroke by ID (for remote undo) */
  removeStroke(strokeId: string): void {
    const idx = this.strokes.findIndex(s => s.id === strokeId);
    if (idx !== -1) {
      this.strokes.splice(idx, 1);
      this.render();
    }
  }

  /** Remove last stroke from a user (for remote undo without stroke ID) */
  removeLastStrokeByUser(userId: string): void {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.strokes[i].user_id === userId) {
        this.strokes.splice(i, 1);
        this.render();
        return;
      }
    }
  }

  /** Load a snapshot (array of strokes) */
  loadSnapshot(strokes: Stroke[]): void {
    this.strokes = [...strokes];
    this.render();
  }

  /** Get current strokes as snapshot */
  getSnapshot(): Stroke[] {
    return [...this.strokes];
  }

  /** Clear the canvas */
  clear(): void {
    this.strokes = [];
    this.render();
  }

  /** Export canvas as PNG blob */
  exportPNG(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export canvas'));
      }, 'image/png');
    });
  }

  /** Full re-render */
  render(): void {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;

    this.ctx.save();
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, w, h);
    // White background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, w, h);

    for (const stroke of this.strokes) {
      this.drawStroke(stroke);
    }
    this.ctx.restore();
  }

  private drawStroke(stroke: Stroke): void {
    if (stroke.path_data.length === 0) return;

    this.ctx.save();
    this.applyStrokeStyle(stroke);

    const points = stroke.path_data;

    if (points.length === 1) {
      // Single dot
      this.ctx.beginPath();
      this.ctx.arc(points[0].x, points[0].y, stroke.width / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private applyStrokeStyle(stroke: Stroke): void {
    if (stroke.tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
      this.ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = stroke.color;
      this.ctx.fillStyle = stroke.color;
    }
    this.ctx.lineWidth = stroke.width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }
}
