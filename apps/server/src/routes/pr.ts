import { Router } from 'express';
import { z } from 'zod';
import { createGithubClient } from '../services/github.js';
import { openDocsPr } from '../services/pr.js';

export const routes = Router();

routes.post('/docs', async (req, res) => {
  const schema = z.object({ repo: z.string(), branch: z.string().default('patchly/docs'), readme: z.string(), contributing: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const { repo, branch, readme, contributing } = parsed.data;
  try {
    const gh = createGithubClient();
    const url = await openDocsPr(gh, { repo, branch, readme, contributing });
    return res.json({ ok: true, url });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});


