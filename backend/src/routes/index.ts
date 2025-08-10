// backend/src/routes/index.ts
import type { FastifyInstance } from 'fastify';

export default async function registerRoutes(app: FastifyInstance) {
  // Dynamisk import så vi tåler både default- og named-eksporter
  const mod = await import('./marketing.js');

  // Plukk ut plugin-funksjonen uansett navn
  const plugin =
    (mod as any).default ??
    (mod as any).marketing ??
    (mod as any).routes ??
    (mod as any).plugin;

  if (typeof plugin !== 'function') {
    throw new Error('marketing route module does not export a plugin function');
  }

  // Registrer under /api
  app.register(plugin, { prefix: '/api' });

  // Merk: vi registrerer ikke /videos her, siden den modulen ikke finnes ennå.
}
