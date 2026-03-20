import type { FastifyInstance } from 'fastify';
import { canvasStore } from '../stores/canvas-store.js';
import { participantStore } from '../stores/participant-store.js';
import { generateNickname } from '@doodleshare/shared';

export async function participantRoutes(fastify: FastifyInstance) {
  // Join canvas
  fastify.post<{ Params: { id: string }; Body: { nickname?: string } }>('/api/canvas/:id/join', async (request, reply) => {
    const canvas = canvasStore.get(request.params.id);
    if (!canvas) return reply.status(404).send({ error: 'Canvas not found' });

    const userId = request.user?.id || null;
    const nickname = request.body.nickname || request.user?.username || generateNickname();
    const role = canvas.owner_id === userId ? 'owner' : 'guest';

    const participant = participantStore.add(canvas.id, userId, role, nickname);
    return participant;
  });

  // List participants
  fastify.get<{ Params: { id: string } }>('/api/canvas/:id/participants', async (request, reply) => {
    const canvas = canvasStore.get(request.params.id);
    if (!canvas) return reply.status(404).send({ error: 'Canvas not found' });
    return participantStore.getByCanvas(canvas.id);
  });

  // Leave canvas
  fastify.delete<{ Params: { id: string } }>('/api/canvas/:id/leave', async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Auth required' });
    participantStore.remove(request.params.id, request.user.id);
    return { success: true };
  });
}
