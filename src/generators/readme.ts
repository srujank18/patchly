import { createGithubClient, getDefaultBranch, getFileContent, getRepoLanguages, parseRepo } from '../services/github.js';
import type { PatchlyConfig } from '../config.js';
import { generateReadmeWithAI } from '../services/ai.js';

export async function generateDocs(config: PatchlyConfig): Promise<string> {
  const gh = createGithubClient(config);
  const { owner, repo } = parseRepo(config.repo);
  const fullName = `${owner}/${repo}`;
  const defaultBranch = await getDefaultBranch(gh, config.repo);
  const languages = await getRepoLanguages(gh, config.repo);
  const repoInfo = await gh.rest.repos.get({ owner, repo });
  const topicsResp = await gh.rest.repos.getAllTopics({ owner, repo });
  const readmeResp = await getFileContent(gh, config.repo, 'README.md', defaultBranch);
  const readme = await generateReadmeWithAI({
    config,
    repo: { fullName, description: repoInfo.data.description ?? undefined, homepage: repoInfo.data.homepage ?? undefined },
    languages,
    topics: topicsResp.data.names ?? [],
    existingReadme: readmeResp?.content
  });
  return readme;
}


