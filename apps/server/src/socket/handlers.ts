import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@doodleshare/shared';
import { participantStore } from '../stores/participant-store.js';
import { strokeBuffer } from '../stores/stroke-buffer.js';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents>) {
  io.on('connection', (socket: TypedSocket) => {
    const userId = socket.handshake.auth.userId as string;
    let currentCanvasId: string | null = null;

    socket.on('join_canvas', ({ canvasId, nickname }) => {
      currentCanvasId = canvasId;
      socket.join(canvasId);

      // Find or create participant (prevents duplicates on rejoin/refresh)
      let me = participantStore.findByUser(canvasId, userId);
      if (me) {
        participantStore.setOnline(canvasId, userId, true);
      } else {
        // Auto-create participant if not registered via REST API
        me = participantStore.add(canvasId, userId, 'guest', nickname || 'Anonymous');
      }

      socket.to(canvasId).emit('participant_joined', me);
      socket.emit('participant_list', participantStore.getByCanvas(canvasId));
    });

    socket.on('leave_canvas', ({ canvasId }) => {
      socket.leave(canvasId);
      participantStore.setOnline(canvasId, userId, false);
      socket.to(canvasId).emit('participant_left', { participantId: '', userId });
      currentCanvasId = null;
    });

    socket.on('stroke_start', ({ canvasId, stroke }) => {
      socket.to(canvasId).emit('stroke_started', stroke);
      strokeBuffer.push(canvasId, stroke);
    });

    socket.on('stroke_continue', ({ canvasId, strokeId, points }) => {
      socket.to(canvasId).emit('stroke_continued', { strokeId, points });
    });

    socket.on('stroke_end', ({ canvasId, strokeId }) => {
      socket.to(canvasId).emit('stroke_ended', { strokeId });
    });

    socket.on('cursor_move', ({ canvasId, x, y }) => {
      const participants = participantStore.getByCanvas(canvasId);
      const me = participants.find(p => p.user_id === userId);
      if (me) {
        socket.to(canvasId).emit('cursor_moved', {
          userId,
          x,
          y,
          nickname: me.nickname,
          color: me.cursor_color,
        });
      }
    });

    socket.on('undo_stroke', ({ canvasId, userId: undoUserId }) => {
      socket.to(canvasId).emit('stroke_undone', { userId: undoUserId, strokeId: '' });
    });

    socket.on('disconnect', () => {
      if (currentCanvasId) {
        participantStore.setOnline(currentCanvasId, userId, false);
        socket.to(currentCanvasId).emit('participant_left', { participantId: '', userId });
      }
    });
  });
}
