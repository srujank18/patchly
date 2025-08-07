import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const ConfigSchema = z.object({
  repo: z.string().default(''),
  baseBranch: z.string().default('main'),
  defaultModel: z.string().default('gpt-4o-mini'),
  prLabels: z.array(z.string()).default(['patchly']),
  docs: z.object({
    readme: z.boolean().default(true),
    contributing: z.boolean().default(true)
  }).default({ readme: true, contributing: true }),
  scanning: z.object({
    vulnerabilities: z.boolean().default(true),
    licenses: z.boolean().default(true)
  }).default({ vulnerabilities: true, licenses: true })
});

export type PatchlyConfig = z.infer<typeof ConfigSchema> & {
  tokens: { githubToken: string; openaiKey: string };
};

export async function loadConfig(opts?: { repoOverride?: string }): Promise<PatchlyConfig> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'patchly.config.json');
  let raw: unknown = {};
  try {
    const txt = await fs.readFile(configPath, 'utf8');
    raw = JSON.parse(txt);
  } catch {}
  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('Invalid patchly.config.json');
  }
  const envGithub = process.env.GH_TOKEN ?? '';
  const envOpenai = process.env.OPENAI_API_KEY ?? '';
  const cfg = parsed.data;
  if (opts?.repoOverride) cfg.repo = opts.repoOverride;
  return {
    ...cfg,
    tokens: { githubToken: envGithub, openaiKey: envOpenai }
  };
}


