import type { FastifyInstance } from 'fastify';
import { canvasStore } from '../stores/canvas-store.js';
import { participantStore } from '../stores/participant-store.js';

export async function canvasRoutes(fastify: FastifyInstance) {
  // Create canvas
  fastify.post<{ Body: { title: string } }>('/api/canvas', async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Auth required' });
    const canvas = canvasStore.create(request.user.id, request.body.title);
    // Add owner as participant
    participantStore.add(canvas.id, request.user.id, 'owner', request.user.username);
    return canvas;
  });

  // List my canvases
  fastify.get('/api/canvas', async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Auth required' });
    return canvasStore.getByOwner(request.user.id);
  });

  // Get single canvas
  fastify.get<{ Params: { id: string } }>('/api/canvas/:id', async (request, reply) => {
    const canvas = canvasStore.get(request.params.id);
    if (!canvas) return reply.status(404).send({ error: 'Canvas not found' });
    return canvas;
  });

  // Update canvas (owner only)
  fastify.patch<{ Params: { id: string }; Body: { title?: string; is_public?: boolean } }>('/api/canvas/:id', async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Auth required' });
    const canvas = canvasStore.get(request.params.id);
    if (!canvas) return reply.status(404).send({ error: 'Canvas not found' });
    if (canvas.owner_id !== request.user.id) return reply.status(403).send({ error: 'Not owner' });
    const updated = canvasStore.update(request.params.id, request.body);
    return updated;
  });

  // Delete canvas (owner only)
  fastify.delete<{ Params: { id: string } }>('/api/canvas/:id', async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Auth required' });
    const canvas = canvasStore.get(request.params.id);
    if (!canvas) return reply.status(404).send({ error: 'Canvas not found' });
    if (canvas.owner_id !== request.user.id) return reply.status(403).send({ error: 'Not owner' });
    canvasStore.delete(request.params.id);
    participantStore.removeAll(request.params.id);
    return { success: true };
  });

  // Get canvas by share token (for join page)
  fastify.get<{ Params: { token: string } }>('/api/canvas/join/:token', async (request, reply) => {
    const canvas = canvasStore.getByShareToken(request.params.token);
    if (!canvas) return reply.status(404).send({ error: 'Invalid invite link' });
    return { id: canvas.id, title: canvas.title, is_public: canvas.is_public };
  });
}
