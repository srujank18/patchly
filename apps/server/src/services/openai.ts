import OpenAI from 'openai';

function ensureClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY');
  return new OpenAI({ apiKey: key });
}

export async function generateReadme(params: { repoFullName: string; description?: string; homepage?: string; topics: string[]; languages: Record<string, number> }) {
  const client = ensureClient();
  const model = 'gpt-4o-mini';
  const system = 'You write high-quality README.md files for open-source projects. Be accurate and concise.';
  const user = `Generate README.md for ${params.repoFullName}.\nDescription: ${params.description ?? 'N/A'}\nHomepage: ${params.homepage ?? 'N/A'}\nTopics: ${params.topics.join(', ') || 'N/A'}\nLanguages: ${Object.keys(params.languages).join(', ')}`;
  const r = await client.chat.completions.create({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.4 });
  return r.choices?.[0]?.message?.content?.trim() ?? '';
}

export async function generateContributing(params: { repoFullName: string; languages: Record<string, number> }) {
  const client = ensureClient();
  const model = 'gpt-4o-mini';
  const system = 'You write CONTRIBUTING.md files for open-source projects focusing on setup, style, testing, and PR process.';
  const user = `Generate CONTRIBUTING.md for ${params.repoFullName}. Languages: ${Object.keys(params.languages).join(', ')}`;
  const r = await client.chat.completions.create({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.4 });
  return r.choices?.[0]?.message?.content?.trim() ?? '';
}


