// backend/src/routes/marketing.ts
import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fastify plugin for marketing routes
 * Registreres i index.ts med prefix '/api', så disse blir:
 *   GET    /api/marketing
 *   DELETE /api/marketing/:id
 */
export default async function marketingRoutes(app: FastifyInstance) {
  // List alle CampaignRequest (nyeste først)
  app.get('/marketing', async () => {
    const rows = await prisma.campaignRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows;
  });

  // Slett én CampaignRequest
  app.delete<{ Params: { id: string } }>('/marketing/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      await prisma.campaignRequest.delete({ where: { id } });
      reply.code(204).send(); // No Content
    } catch {
      // Returner 404 hvis ikke funnet (greit for admin-UI)
      reply.code(404).send({ ok: false, message: 'Not found' });
    }
  });
}


