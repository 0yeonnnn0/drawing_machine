import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@doodleshare/shared';
import { authPlugin } from './plugins/auth.js';
import { authRoutes } from './routes/auth.js';
import { canvasRoutes } from './routes/canvas.js';
import { participantRoutes } from './routes/participant.js';
import { registerSocketHandlers } from './socket/handlers.js';
import { startFlushJob } from './stores/stroke-buffer.js';

const PORT = 4000;

async function main() {
  const fastify = Fastify({ logger: true });

  // CORS
  await fastify.register(cors, { origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true });

  // Auth
  await fastify.register(authPlugin);

  // Routes
  await fastify.register(authRoutes);
  await fastify.register(canvasRoutes);
  await fastify.register(participantRoutes);

  // Health check
  fastify.get('/api/health', async () => ({ status: 'ok' }));

  // Start HTTP server
  await fastify.listen({ port: PORT, host: '0.0.0.0' });

  // Socket.io (attach to Fastify's HTTP server)
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(fastify.server, {
    cors: { origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true },
  });

  registerSocketHandlers(io);

  // Start 30-second stroke flush job
  startFlushJob();

  console.log(`Server running on http://localhost:${PORT}`);
}

main().catch(console.error);
