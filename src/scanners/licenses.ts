import type { PatchlyConfig } from '../config.js';
import { createGithubClient, getDefaultBranch } from '../services/github.js';

export type LicenseReport = {
  projectLicense: string | null;
  issues: string[];
};

export async function analyzeProjectLicense(config: PatchlyConfig): Promise<LicenseReport> {
  const gh = createGithubClient(config);
  const { owner, repo } = ((r: string) => { const [o, n] = r.split('/'); return { owner: o, repo: n }; })(config.repo);
  const base = await getDefaultBranch(gh, config.repo);
  let projectLicense: string | null = null;
  try {
    const lic = await gh.rest.licenses.getForRepo({ owner, repo });
    projectLicense = lic.data.license?.spdx_id ?? lic.data.license?.key ?? null;
  } catch (e: any) {
    if (e.status !== 404) throw e;
  }
  const issues: string[] = [];
  if (!projectLicense) {
    issues.push('No LICENSE detected in repository');
  }
  // Placeholder for dependency license conflict checks
  // Future: build SBOM and check SPDX compatibility
  return { projectLicense, issues };
}


