import { Router } from 'express';
import { z } from 'zod';
import { createGithubClient } from '../services/github.js';
import { generateReadme, generateContributing } from '../services/openai.js';

export const routes = Router();

routes.post('/generate', async (req, res) => {
  const schema = z.object({ repo: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const { repo } = parsed.data;
  try {
    const gh = createGithubClient();
    const [owner, name] = repo.split('/');
    const repoInfo = await gh.rest.repos.get({ owner, repo: name });
    const topics = await gh.rest.repos.getAllTopics({ owner, repo: name });
    const languages = await gh.rest.repos.listLanguages({ owner, repo: name });
    const readme = await generateReadme({
      repoFullName: repoInfo.data.full_name,
      description: repoInfo.data.description ?? undefined,
      homepage: repoInfo.data.homepage ?? undefined,
      topics: topics.data.names ?? [],
      languages: languages.data as Record<string, number>,
    });
    const contributing = await generateContributing({ repoFullName: repoInfo.data.full_name, languages: languages.data as Record<string, number> });
    return res.json({ ok: true, readme, contributing });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});


