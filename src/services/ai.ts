import OpenAI from 'openai';
import type { PatchlyConfig } from '../config.js';

export function createOpenAI(config: PatchlyConfig) {
  if (!config.tokens.openaiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey: config.tokens.openaiKey });
}

export async function generateReadmeWithAI(params: {
  config: PatchlyConfig;
  repo: { fullName: string; description?: string; homepage?: string };
  languages: Record<string, number>;
  topics: string[];
  existingReadme?: string;
}): Promise<string> {
  const client = createOpenAI(params.config);
  const model = params.config.defaultModel;
  const { fullName, description, homepage } = params.repo;
  const languages = Object.entries(params.languages)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, bytes]) => `${lang} (${bytes} bytes)`) 
    .slice(0, 6)
    .join(', ');
  const system = 'You are Patchly, an assistant that writes production-grade OSS docs that are actionable, concise, and accurate. Prefer clear sections and runnable examples.';
  const user = `Generate a complete README.md for the GitHub repo ${fullName}.
Description: ${description ?? 'N/A'}
Homepage: ${homepage ?? 'N/A'}
Languages: ${languages}
Topics: ${params.topics.join(', ') || 'N/A'}
Existing README (may be empty):\n\n${params.existingReadme ?? ''}\n\nRequirements:\n- Badges (build, license, npm/pypi if applicable), Overview, Features, Quickstart, Configuration, Usage, Examples, Contributing, Roadmap, Security, License, Acknowledgements.\n- Write commands that likely match the stack (detect language).\n- Keep it succinct but thorough.\n- Do not invent features.`;
  const r = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.4,
  });
  const txt = r.choices?.[0]?.message?.content?.trim();
  if (!txt) throw new Error('AI returned empty README');
  return ensureMarkdown(txt);
}

export async function generateContributingWithAI(params: {
  config: PatchlyConfig;
  repo: { fullName: string };
  languages: Record<string, number>;
}): Promise<string> {
  const client = createOpenAI(params.config);
  const model = params.config.defaultModel;
  const system = 'You are Patchly, an assistant that writes CONTRIBUTING guidelines optimized for quick onboarding and high-quality contributions.';
  const user = `Generate CONTRIBUTING.md for ${params.repo.fullName}. Include: code of conduct pointer, setup, local dev commands, style/lint/test, commit message conventions, PR checklist, issue templates hints, and triage expectations.`;
  const r = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.4,
  });
  const txt = r.choices?.[0]?.message?.content?.trim();
  if (!txt) throw new Error('AI returned empty CONTRIBUTING');
  return ensureMarkdown(txt);
}

function ensureMarkdown(s: string): string {
  // Sometimes models wrap with triple backticks; strip outer fences
  const fence = /^\s*```(?:markdown)?\n([\s\S]*?)\n```\s*$/i;
  const m = s.match(fence);
  return m ? m[1] : s;
}


