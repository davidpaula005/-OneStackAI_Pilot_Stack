import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function financeRoutes(app: FastifyInstance){
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post('/ledger/import', {
    schema: { body: z.object({ rows: z.array(z.array(z.string())) }) }
  }, async (req) => {
    const { rows } = req.body as any;
    return { imported: rows.length - 1 };
  });

  r.post('/invoice', {
    schema: { body: z.object({
      customer: z.object({ name: z.string(), orgNo: z.string().optional(), email: z.string().email().optional() }),
      lines: z.array(z.object({ text: z.string(), qty: z.number(), price: z.number(), vat: z.number().default(0.25) }))
    }) }
  }, async (req) => {
    const b = req.body as any;
    const net = b.lines.reduce((s: number, l: any) => s + l.qty * l.price, 0);
    const vat = b.lines.reduce((s: number, l: any) => s + l.qty * l.price * (l.vat ?? 0.25), 0);
    const total = net + vat;
    return { number: 'INV-'+Math.floor(Math.random()*10000), net, vat, total, status:'draft' };
  });

  r.get('/saft/export', async () => {
    const xml = `<?xml version="1.0"?><AuditFile><Header><AuditFileVersion>1.30</AuditFileVersion></Header></AuditFile>`;
    return { xml };
  });
}


