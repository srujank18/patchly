import fetch from 'node-fetch';
import { createGithubClient, splitRepo } from './github.js';

type VulnFinding = { package: string; version: string; ecosystem: 'npm'; ids: string[]; summary?: string };

export async function scanVulnerabilities(params: { repo: string }) {
  // Minimal implementation: detect npm deps from package-lock.json if present
  const gh = createGithubClient();
  const { owner, repo } = splitRepo(params.repo);
  let lockJson: any | null = null;
  try {
    const r = await gh.rest.repos.getContent({ owner, repo, path: 'package-lock.json' });
    if (!Array.isArray(r.data) && 'content' in r.data) {
      const text = Buffer.from((r.data as any).content, 'base64').toString('utf8');
      lockJson = JSON.parse(text);
    }
  } catch {}

  const npmPackages = new Map<string, string>();
  if (lockJson?.packages) {
    for (const [k, meta] of Object.entries<any>(lockJson.packages)) {
      if (k.startsWith('node_modules/')) {
        const name = k.replace('node_modules/', '');
        if (meta?.version) npmPackages.set(name, meta.version);
      }
    }
  }

  const queries = Array.from(npmPackages.entries()).map(([name, version]) => ({ package: { ecosystem: 'npm', name }, version }));
  const findings: VulnFinding[] = [];
  if (queries.length) {
    const resp = await fetch('https://api.osv.dev/v1/querybatch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ queries }) });
    if (resp.ok) {
      const data: any = await resp.json();
      for (let i = 0; i < data.results?.length; i++) {
        const res = data.results[i];
        if (res.vulns?.length) {
          const name = queries[i].package.name;
          const version = queries[i].version;
          for (const v of res.vulns) findings.push({ package: name, version, ecosystem: 'npm', ids: v.aliases ?? (v.id ? [v.id] : []), summary: v.summary });
        }
      }
    }
  }

  return { totalFindings: findings.length, affectedPackages: Array.from(new Set(findings.map(f => `${f.package}@${f.version}`))), findings };
}


