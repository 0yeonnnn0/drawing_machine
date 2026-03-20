import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { userStore } from '../stores/user-store.js';
import type { User } from '@doodleshare/shared';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}

export const authPlugin = fp(async function (fastify: FastifyInstance) {
  fastify.decorateRequest('user', undefined);

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    const userId = request.headers['x-user-id'] as string | undefined;
    if (userId) {
      request.user = userStore.get(userId);
    }
  });
});
