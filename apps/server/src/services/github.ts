import { Octokit } from '@octokit/rest';

export function createGithubClient() {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error('Missing GH_TOKEN');
  return new Octokit({ auth: token });
}

export function splitRepo(full: string): { owner: string; repo: string } {
  const [owner, repo] = full.split('/');
  if (!owner || !repo) throw new Error('Invalid repo format, expected owner/name');
  return { owner, repo };
}


