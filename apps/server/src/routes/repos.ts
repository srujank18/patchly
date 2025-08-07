import { Router } from 'express';
import { z } from 'zod';
import { createGithubClient } from '../services/github.js';

export const routes = Router();

routes.post('/link', async (req, res) => {
  const schema = z.object({ repo: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const { repo } = parsed.data;
  try {
    const gh = createGithubClient();
    const [owner, name] = repo.split('/');
    const info = await gh.rest.repos.get({ owner, repo: name });
    return res.json({ ok: true, repo: info.data.full_name });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});


