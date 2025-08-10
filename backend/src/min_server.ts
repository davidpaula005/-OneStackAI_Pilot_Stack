import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { routes } from './index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ZodTypeProvider, validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Fastify + Zod
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // CORS (kan stå på selv om vi snart server frontend fra samme domene)
  await app.register(cors, { origin: true });

  // ⬇️ Server statiske filer fra ../frontend på rot ('/')
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', 'frontend'),
    prefix: '/',
    decorateReply: false
  });

  // API-ruter
  await routes(app);

  // Start
  await app.listen({ host: 'localhost', port: 3000 });
  console.log('✅ API + Frontend på http://localhost:3000');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
