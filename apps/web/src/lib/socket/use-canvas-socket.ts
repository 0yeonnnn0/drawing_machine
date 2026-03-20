'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { CanvasParticipant, Stroke, StrokePoint } from '@doodleshare/shared';
import { getSocket, disconnectSocket } from './socket-client';
import type { DrawingEngine } from '@/lib/canvas/drawing-engine';

interface CursorInfo {
  userId: string;
  x: number;
  y: number;
  nickname: string;
  color: string;
}

interface UseCanvasSocketOptions {
  canvasId: string;
  userId: string;
  nickname: string;
  getEngine: () => DrawingEngine | null;
}

export function useCanvasSocket({ canvasId, userId, nickname, getEngine }: UseCanvasSocketOptions) {
  const [participants, setParticipants] = useState<CanvasParticipant[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, CursorInfo>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const cursorThrottleRef = useRef<number>(0);

  useEffect(() => {
    const socket = getSocket(userId);

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('join_canvas', { canvasId, userId, nickname });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.io.on('reconnect_attempt', () => {
      setConnectionStatus('reconnecting');
    });

    socket.on('participant_list', (list) => {
      setParticipants(list);
    });

    socket.on('participant_joined', (participant) => {
      setParticipants(prev => {
        if (prev.some(p => p.id === participant.id)) return prev;
        return [...prev, participant];
      });
    });

    socket.on('participant_left', ({ userId: leftUserId }) => {
      setParticipants(prev => prev.filter(p => p.user_id !== leftUserId));
      setRemoteCursors(prev => {
        const next = new Map(prev);
        next.delete(leftUserId);
        return next;
      });
    });

    socket.on('stroke_started', (stroke: Stroke) => {
      getEngine()?.addRemoteStroke(stroke);
    });

    socket.on('stroke_undone', ({ userId: undoUserId }) => {
      getEngine()?.removeLastStrokeByUser(undoUserId);
    });

    socket.on('cursor_moved', (data) => {
      setRemoteCursors(prev => {
        const next = new Map(prev);
        next.set(data.userId, data);
        return next;
      });
    });

    socket.on('canvas_deleted', () => {
      window.location.href = '/dashboard';
    });

    // If not connected yet, connect
    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected, join canvas
      socket.emit('join_canvas', { canvasId, userId, nickname });
    }

    return () => {
      socket.emit('leave_canvas', { canvasId });
      socket.off('connect');
      socket.off('disconnect');
      socket.off('participant_list');
      socket.off('participant_joined');
      socket.off('participant_left');
      socket.off('stroke_started');
      socket.off('stroke_undone');
      socket.off('cursor_moved');
      socket.off('canvas_deleted');
      disconnectSocket();
    };
  }, [canvasId, userId, nickname, getEngine]);

  const emitStroke = useCallback((stroke: Stroke) => {
    const socket = getSocket(userId);
    socket.emit('stroke_start', { canvasId, stroke });
    socket.emit('stroke_end', { canvasId, strokeId: stroke.id });
  }, [canvasId, userId]);

  const emitCursorMove = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - cursorThrottleRef.current < 50) return; // throttle to 20fps
    cursorThrottleRef.current = now;
    const socket = getSocket(userId);
    socket.emit('cursor_move', { canvasId, x, y });
  }, [canvasId, userId]);

  const emitUndo = useCallback(() => {
    const socket = getSocket(userId);
    socket.emit('undo_stroke', { canvasId, userId });
  }, [canvasId, userId]);

  return {
    participants,
    remoteCursors,
    connectionStatus,
    emitStroke,
    emitCursorMove,
    emitUndo,
  };
}
