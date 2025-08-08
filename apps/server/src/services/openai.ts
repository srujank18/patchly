import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function ensureClient() {
  if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
  return new OpenAI({ apiKey: OPENAI_API_KEY });
}

export async function generateReadme(params: {
  repoFullName: string;
  description?: string;
  homepage?: string;
  topics: string[];
  languages: Record<string, number>;
}) {
  // If no API key, return mock data for testing
  if (!OPENAI_API_KEY) {
    return `# Mock README for ${params.repoFullName}

This is a mock README generated for testing purposes.

Description: ${params.description ?? 'N/A'}
Homepage: ${params.homepage ?? 'N/A'}
Topics: ${params.topics.join(', ') || 'N/A'}
Languages: ${Object.keys(params.languages).join(', ')}`;
  }

  // Otherwise, call the real OpenAI API
  const client = ensureClient();
  const model = 'gpt-4o-mini';
  const system = 'You write high-quality README.md files for open-source projects. Be accurate and concise.';
  const user = `Generate README.md for ${params.repoFullName}.
Description: ${params.description ?? 'N/A'}
Homepage: ${params.homepage ?? 'N/A'}
Topics: ${params.topics.join(', ') || 'N/A'}
Languages: ${Object.keys(params.languages).join(', ')}`;

  const r = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.4,
  });

  return r.choices?.[0]?.message?.content?.trim() ?? '';
}

export async function generateContributing(params: {
  repoFullName: string;
  languages: Record<string, number>;
}) {
  // If no API key, return mock data for testing
  if (!OPENAI_API_KEY) {
    return `# Mock CONTRIBUTING for ${params.repoFullName}

This is a mock CONTRIBUTING guide generated for testing purposes.

Languages: ${Object.keys(params.languages).join(', ')}`;
  }

  // Otherwise, call the real OpenAI API
  const client = ensureClient();
  const model = 'gpt-4o-mini';
  const system = 'You write CONTRIBUTING.md files for open-source projects focusing on setup, style, testing, and PR process.';
  const user = `Generate CONTRIBUTING.md for ${params.repoFullName}. Languages: ${Object.keys(params.languages).join(', ')}`;

  const r = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.4,
  });

  return r.choices?.[0]?.message?.content?.trim() ?? '';
}