import Fastify from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyStatic from '@fastify/static';

const app = Fastify({ logger: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.resolve(__dirname, '../../frontend');

app.register(fastifyStatic, { root: staticRoot, prefix: '/' });
app.get('/healthz', async () => ({ ok: true }));

const routes = (await import('./routes/index.js')).default;
app.register(routes);

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: '0.0.0.0' });
