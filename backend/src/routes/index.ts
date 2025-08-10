import type { FastifyInstance } from 'fastify';
import { marketingRoutes } from './routes/marketing.js';

export async function routes(app: FastifyInstance) {
  await app.register(marketingRoutes, { prefix: '/api/marketing' });
}
