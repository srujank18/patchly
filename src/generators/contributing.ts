import { createGithubClient, getRepoLanguages, parseRepo } from '../services/github.js';
import type { PatchlyConfig } from '../config.js';
import { generateContributingWithAI } from '../services/ai.js';

export async function generateContributing(config: PatchlyConfig): Promise<string> {
  const gh = createGithubClient(config);
  const { owner, repo } = parseRepo(config.repo);
  const fullName = `${owner}/${repo}`;
  const languages = await getRepoLanguages(gh, config.repo);
  const contributing = await generateContributingWithAI({ config, repo: { fullName }, languages });
  return contributing;
}


