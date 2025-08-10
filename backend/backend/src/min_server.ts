import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './index';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await routes(app);

const host = 'localhost';
const port = 3000;

app.listen({ host, port }).then(() => {
  console.log(`✅ API ready on http://${host}:${port}`);
}).catch((err) => {
  app.log.error(err);
  process.exit(1);
});

