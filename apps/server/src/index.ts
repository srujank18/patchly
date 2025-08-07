import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { routes as repoRoutes } from './routes/repos.js';
import { routes as docsRoutes } from './routes/docs.js';
import { routes as scanRoutes } from './routes/scan.js';
import { routes as prRoutes } from './routes/pr.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/repos', repoRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/pr', prRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Patchly API listening on http://localhost:${port}`);
});


