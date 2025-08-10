// backend/src/routes/index.ts

import type { FastifyInstance } from 'fastify';

// Viktig: bruk .js i import-stien når du bygger ESM fra TypeScript.
// (TS kompilerer .ts -> .js i dist/, og Node forventer .js i runtime.)
import marketing from './marketing.js';
import videos from './videos.js';

export default async function registerRoutes(app: FastifyInstance) {
  // Alle API-endepunkt under /api
  app.register(marketing, { prefix: '/api' });
  app.register(videos, { prefix: '/api' });

  // (Hvis du ikke har videos.ts enda, kommenter de to linjene over som gjelder "videos")
}
