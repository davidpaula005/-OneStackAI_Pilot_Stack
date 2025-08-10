import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function bookingRoutes(app: FastifyInstance){
  app.post('/setup', {
    schema: { body: z.object({ calendar: z.string(), deposit: z.boolean().default(false), reminder: z.string().optional() }) }
  }, async (req,res)=>{
    const b = req.body as any;
    return { ok: true, depositLinkExample: b.deposit ? 'https://pay.example/dep_abc123' : null };
  });
}
