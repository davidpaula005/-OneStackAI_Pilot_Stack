import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function marketingRoutes(app: FastifyInstance) {
  app.get('/marketing', async () => {
    return prisma.campaignRequest.findMany({ orderBy: { createdAt: 'desc' } });
  });

  app.delete<{ Params: { id: string } }>('/marketing/:id', async (req, reply) => {
    try {
      await prisma.campaignRequest.delete({ where: { id: req.params.id } });
      reply.code(204).send();
    } catch {
      reply.code(404).send({ ok: false, message: 'Not found' });
    }
  });
}
