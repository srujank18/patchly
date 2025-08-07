import { createGithubClient, splitRepo } from './github.js';

export async function detectProjectLicense(params: { repo: string }) {
  const gh = createGithubClient();
  const { owner, repo } = splitRepo(params.repo);
  try {
    const lic = await gh.rest.licenses.getForRepo({ owner, repo });
    const spdx = lic.data.license?.spdx_id ?? null;
    return { projectLicense: spdx, issues: spdx ? [] : ['No LICENSE detected'] };
  } catch (e: any) {
    if (e.status === 404) return { projectLicense: null, issues: ['No LICENSE detected'] };
    throw e;
  }
}


