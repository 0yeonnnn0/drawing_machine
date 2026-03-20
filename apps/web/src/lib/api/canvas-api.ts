import type { Canvas, CanvasParticipant } from '@doodleshare/shared';
import { api } from './client';

export const canvasApi = {
  create: (title: string) =>
    api.post<Canvas>('/api/canvas', { title }),

  list: () =>
    api.get<Canvas[]>('/api/canvas'),

  get: (id: string) =>
    api.get<Canvas>(`/api/canvas/${id}`),

  update: (id: string, data: { title?: string; is_public?: boolean }) =>
    api.patch<Canvas>(`/api/canvas/${id}`, data),

  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/api/canvas/${id}`),

  getByToken: (token: string) =>
    api.get<{ id: string; title: string; is_public: boolean }>(`/api/canvas/join/${token}`),

  join: (canvasId: string, nickname?: string) =>
    api.post<CanvasParticipant>(`/api/canvas/${canvasId}/join`, { nickname }),

  getParticipants: (canvasId: string) =>
    api.get<CanvasParticipant[]>(`/api/canvas/${canvasId}/participants`),
};
