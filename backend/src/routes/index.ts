import type { FastifyInstance } from 'fastify';
import marketing from './marketing.js';  // riktig sti, default export
export default async function registerRoutes(app: FastifyInstance) {
  app.register(marketing, { prefix: '/api' });
}
