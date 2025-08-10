import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function salesRoutes(app: FastifyInstance){
  app.post('/offer', {
    schema: { body: z.object({ scope: z.string(), price: z.number(), warranty: z.string().optional() }) }
  }, async (req,res)=>{
    const b = req.body as any;
    const mk = (name:string,m:number)=>({ name, price: Math.round(b.price*m), items:[b.scope, (b.warranty||'6 mnd')+' garanti', m>1?'Prioritert support':'Standard support'] });
    return { tiers: [mk('God',1), mk('Bedre',1.3), mk('Best',1.6)] };
  });
}
