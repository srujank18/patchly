import { Router } from 'express';
import { z } from 'zod';
import { scanVulnerabilities } from '../services/osv.js';
import { detectProjectLicense } from '../services/spdx.js';

export const routes = Router();

routes.post('/', async (req, res) => {
  const schema = z.object({ repo: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const { repo } = parsed.data;
  try {
    const [vulns, license] = await Promise.all([
      scanVulnerabilities({ repo }),
      detectProjectLicense({ repo })
    ]);
    return res.json({ ok: true, vulns, license });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});


