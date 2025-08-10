// backend/src/index.ts
import type { FastifyInstance } from 'fastify';
import marketingRoutes from './routes/marketing.js'; // default export

export default async function registerRoutes(app: FastifyInstance) {
  app.register(marketingRoutes, { prefix: '/api' });
}
