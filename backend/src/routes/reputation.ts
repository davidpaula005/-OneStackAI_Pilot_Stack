import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function reputationRoutes(app: FastifyInstance){
  app.post('/reply', {
    schema: { body: z.object({ platform: z.string(), tone: z.enum(['vennlig','formell']), text: z.string() }) }
  }, async (req,res)=>{
    const { tone, text } = req.body as any;
    const reply = tone==='formell'
      ? 'Takk for tilbakemeldingen. Dette var ikke slik vi ønsker. Send ordrenr. på e-post så løser vi saken umiddelbart.'
      : 'Skjønner! Slik skal det ikke være. Kan du sende ordrenr. på DM? Vi fikser opp — og gjør det godt igjen.';
    return { reply };
  });
}
