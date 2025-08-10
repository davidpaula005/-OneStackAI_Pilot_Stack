// backend/src/min_server.ts
import Fastify from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyStatic from '@fastify/static';

const app = Fastify({ logger: true });

// ESM __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.resolve(__dirname, '../../frontend');

// Statiske filer (marketing.html, admin.html, styles.css, osv.)
app.register(fastifyStatic, {
  root: staticRoot,
  prefix: '/', // så /admin.html og /marketing.html fungerer
});

// Healthcheck
app.get('/healthz', async () => ({ ok: true }));

// API-ruter
const routes = (await import('./routes/index.js')).default;
app.register(routes);

// Start server – VIKTIG: host 0.0.0.0 og Render-port
const port = Number(process.env.PORT ?? 3000);
const host = '0.0.0.0';

try {
  await app.listen({ port, host });
  console.log(`✅ Server listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

