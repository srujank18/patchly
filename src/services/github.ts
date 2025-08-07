import { Octokit } from '@octokit/rest';
import type { PatchlyConfig } from '../config.js';

export function createGithubClient(config: PatchlyConfig) {
  if (!config.tokens.githubToken) {
    throw new Error('GH_TOKEN is not set');
  }
  return new Octokit({ auth: config.tokens.githubToken });
}

export function parseRepo(repo: string): { owner: string; repo: string } {
  const [owner, name] = repo.split('/');
  if (!owner || !name) throw new Error(`Invalid repo: ${repo}`);
  return { owner, repo: name };
}

export async function getDefaultBranch(octokit: Octokit, fullRepo: string): Promise<string> {
  const { owner, repo } = parseRepo(fullRepo);
  const r = await octokit.rest.repos.get({ owner, repo });
  return r.data.default_branch;
}

export async function getRepoLanguages(octokit: Octokit, fullRepo: string): Promise<Record<string, number>> {
  const { owner, repo } = parseRepo(fullRepo);
  const r = await octokit.rest.repos.listLanguages({ owner, repo });
  return r.data as unknown as Record<string, number>;
}

export async function getFileContent(octokit: Octokit, fullRepo: string, path: string, ref?: string): Promise<{ content: string; sha: string } | null> {
  const { owner, repo } = parseRepo(fullRepo);
  try {
    const r = await octokit.rest.repos.getContent({ owner, repo, path, ref });
    if (!Array.isArray(r.data) && 'content' in r.data && typeof r.data.content === 'string') {
      const buff = Buffer.from(r.data.content, 'base64');
      return { content: buff.toString('utf8'), sha: r.data.sha };
    }
    return null;
  } catch (e: any) {
    if (e.status === 404) return null;
    throw e;
  }
}

export async function ensureBranch(octokit: Octokit, fullRepo: string, from: string, to: string): Promise<void> {
  const { owner, repo } = parseRepo(fullRepo);
  try {
    await octokit.rest.git.getRef({ owner, repo, ref: `heads/${to}` });
    return; // exists
  } catch (e: any) {
    if (e.status !== 404) throw e;
  }
  const base = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${from}` });
  const sha = base.data.object.sha;
  await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${to}`, sha });
}

export async function upsertFile(octokit: Octokit, fullRepo: string, params: { path: string; content: string; message: string; branch: string }): Promise<void> {
  const { owner, repo } = parseRepo(fullRepo);
  const existing = await getFileContent(octokit, fullRepo, params.path, params.branch);
  const contentEncoded = Buffer.from(params.content, 'utf8').toString('base64');
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: params.path,
    message: params.message,
    content: contentEncoded,
    branch: params.branch,
    sha: existing?.sha
  });
}

export async function createPullRequest(octokit: Octokit, fullRepo: string, params: { title: string; body?: string; head: string; base: string; labels?: string[] }): Promise<string> {
  const { owner, repo } = parseRepo(fullRepo);
  const pr = await octokit.rest.pulls.create({ owner, repo, title: params.title, head: params.head, base: params.base, body: params.body });
  if (params.labels?.length) {
    await octokit.rest.issues.addLabels({ owner, repo, issue_number: pr.data.number, labels: params.labels });
  }
  return pr.data.html_url;
}


