import type { CanvasParticipant, ParticipantRole } from '@doodleshare/shared';
import { CURSOR_COLORS } from '@doodleshare/shared';
import { v4 as uuid } from 'uuid';

// canvasId -> participants
const participants = new Map<string, CanvasParticipant[]>();

export const participantStore = {
  add(canvasId: string, userId: string | null, role: ParticipantRole, nickname: string): CanvasParticipant {
    if (!participants.has(canvasId)) {
      participants.set(canvasId, []);
    }
    const list = participants.get(canvasId)!;
    const colorIndex = list.length % CURSOR_COLORS.length;

    const participant: CanvasParticipant = {
      id: uuid(),
      canvas_id: canvasId,
      user_id: userId,
      role,
      nickname,
      joined_at: new Date().toISOString(),
      is_online: true,
      cursor_color: CURSOR_COLORS[colorIndex],
    };
    list.push(participant);
    return participant;
  },

  findByUser(canvasId: string, userId: string): CanvasParticipant | undefined {
    const list = participants.get(canvasId);
    return list?.find(p => p.user_id === userId);
  },

  getByCanvas(canvasId: string): CanvasParticipant[] {
    return participants.get(canvasId) || [];
  },

  setOnline(canvasId: string, userId: string, online: boolean): void {
    const list = participants.get(canvasId);
    if (!list) return;
    const p = list.find(p => p.user_id === userId);
    if (p) p.is_online = online;
  },

  remove(canvasId: string, userId: string): void {
    const list = participants.get(canvasId);
    if (!list) return;
    const idx = list.findIndex(p => p.user_id === userId);
    if (idx !== -1) list.splice(idx, 1);
  },

  removeAll(canvasId: string): void {
    participants.delete(canvasId);
  },
};
