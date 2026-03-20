import type { FastifyInstance } from 'fastify';
import { userStore } from '../stores/user-store.js';
import { generateNickname } from '@doodleshare/shared';

export async function authRoutes(fastify: FastifyInstance) {
  // Mock login (simulates Google OAuth)
  fastify.post<{ Body: { email: string; username: string } }>('/api/auth/mock-login', async (request, reply) => {
    const { email, username } = request.body;
    const user = userStore.create(email, username);
    return { user, isGuest: false };
  });

  // Guest login
  fastify.post('/api/auth/guest', async () => {
    const nickname = generateNickname();
    const user = userStore.create(null, nickname);
    return { user, isGuest: true };
  });

  // Get current user
  fastify.get('/api/auth/me', async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }
    return { user: request.user };
  });
}
