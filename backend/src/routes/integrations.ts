import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function integrationsRoutes(app: FastifyInstance){
  app.post('/keys', {
    schema: { body: z.object({
      llm_key: z.string().optional(),
      ocr_key: z.string().optional(),
      video_key: z.string().optional(),
      tts_key: z.string().optional(),
      pay_key: z.string().optional(),
      peppol_key: z.string().optional()
    })}
  }, async (req,res)=>{
    // In pilot, we just acknowledge. In prod, store encrypted server-side.
    return { saved: true };
  });
}
