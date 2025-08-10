import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../db.js'; // viktig: .js for ESM

export async function marketingRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  // Health
  r.get('/', async () => ({ message: 'Marketing route works!' }));

  // POST /campaign — lagre input + svar som før
  r.post('/campaign', {
    schema: {
      body: z.object({
        offer: z.string().optional(),
        audience: z.string().optional(),
        goal: z.string().optional(),
        channel: z.string().optional(),
        cta: z.string().optional()
      })
    }
  }, async (req) => {
    const b = req.body as any;

    await prisma.campaignRequest.create({
      data: {
        offer: b.offer ?? null,
        audience: b.audience ?? null,
        goal: b.goal ?? null,
        channel: b.channel ?? null,
        cta: b.cta ?? null,
        ip: (req as any).ip ?? null
      }
    });

    const variants = Array.from({ length: 5 }).map((_, i) => ({
      headline: `${b.offer ?? 'Få mer gjort'} – ${['uten ekstra folk','på 30 dager','med kontroll','uten binding'][i % 4]}`,
      body: `${b.audience ?? 'Bedrifter'} som vil ${b.goal ?? 'øke salget'}: ${['Se hvordan det fungerer','Start gratis pilot','Snakk med oss','Få en plan i dag'][i % 4]}.`,
      cta: b.cta ?? 'Bestill demo'
    }));
    const landing = {
      h1: `${b.offer ?? 'Operativ AI-partner'} for ${b.audience ?? 'SMB'}`,
      h2: `Fra ${b.channel ?? 'chat/voice'} til faktura – én flyt.`,
      bullets: ['24/7 respons', 'Automatisk tilbud og faktura', 'Raskere betaling']
    };
    return { variants, landing };
  });

  // GET /campaigns — siste 20
  r.get('/campaigns', async () =>
    prisma.campaignRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
  );

  // POST /video — lagre jobb
  r.post('/video', {
    schema: {
      body: z.object({
        title: z.string().min(3),
        type: z.enum(['avatar','generativ']),
        length: z.string(),
        voice: z.string().optional(),
        script: z.string().optional()
      })
    }
  }, async (req) => {
    const b = req.body as any;
    const job = await prisma.videoJob.create({
      data: {
        title: b.title,
        type: b.type,
        length: b.length,
        voice: b.voice ?? null,
        script: b.script ?? null,
        status: 'queued'
      }
    });
    return { jobId: job.id, status: job.status };
  });

  // GET /videos — siste 20
  r.get('/videos', async () =>
    prisma.videoJob.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
  );

  // DELETE-endepunkter (MÅ være inne i funksjonen, slik som her)
  r.delete('/campaigns/:id', async (req) => {
    const { id } = req.params as any;
    await prisma.campaignRequest.delete({ where: { id } });
    return { ok: true };
  });

  r.delete('/videos/:id', async (req) => {
    const { id } = req.params as any;
    await prisma.videoJob.delete({ where: { id } });
    return { ok: true };
  });
}


