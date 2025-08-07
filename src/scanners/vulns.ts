import type { PatchlyConfig } from '../config.js';
import { createGithubClient, getDefaultBranch, getFileContent } from '../services/github.js';
import fetch from 'node-fetch';
import { parse as parseYarnLock } from '@yarnpkg/lockfile';
import yaml from 'yaml';

export type VulnFinding = {
  package: string;
  version: string;
  ecosystem: 'npm' | 'PyPI' | 'Go' | 'Maven' | 'NuGet' | 'crates.io';
  ids: string[];
  summary?: string;
};

export type VulnerabilityReport = {
  totalFindings: number;
  affectedPackages: { name: string; version: string; ecosystem: VulnFinding['ecosystem'] }[];
  findings: VulnFinding[];
};

export async function scanVulnerabilities(config: PatchlyConfig): Promise<VulnerabilityReport> {
  const gh = createGithubClient(config);
  const defaultBranch = await getDefaultBranch(gh, config.repo);
  // Try Node.js ecosystems first (npm/yarn/pnpm)
  const pkgJson = await getFileContent(gh, config.repo, 'package.json', defaultBranch);
  const pkgLock = await getFileContent(gh, config.repo, 'package-lock.json', defaultBranch);
  const yarnLock = await getFileContent(gh, config.repo, 'yarn.lock', defaultBranch);
  const pnpmLock = await getFileContent(gh, config.repo, 'pnpm-lock.yaml', defaultBranch);

  const npmPackages = new Map<string, string>();
  if (pkgLock?.content) {
    const json = JSON.parse(pkgLock.content);
    // npm v7+ lockfile format
    if (json.packages) {
      for (const [namePath, meta] of Object.entries<any>(json.packages)) {
        if (!meta?.version) continue;
        // namePath like "node_modules/react" or "" for root
        let name = namePath;
        if (name.startsWith('node_modules/')) name = name.replace('node_modules/', '');
        if (name && meta.version) npmPackages.set(name, meta.version);
      }
    } else if (json.dependencies) {
      // npm v6 lockfile format
      const walk = (deps: any) => {
        for (const [name, meta] of Object.entries<any>(deps)) {
          if (meta.version) npmPackages.set(name, meta.version.replace(/^npm:/, ''));
          if (meta.dependencies) walk(meta.dependencies);
        }
      };
      walk(json.dependencies);
    }
  } else if (yarnLock?.content) {
    const parsed = parseYarnLock(yarnLock.content);
    const obj = parsed.object ?? {};
    for (const [key, meta] of Object.entries<any>(obj)) {
      // key like "react@^18.2.0". We attempt to normalize the name
      const name = key.split('@').filter(Boolean)[0];
      if (meta?.version) npmPackages.set(name, meta.version);
    }
  } else if (pnpmLock?.content) {
    const doc = yaml.parse(pnpmLock.content);
    const pkgs = doc?.packages ?? {};
    for (const [key, meta] of Object.entries<any>(pkgs)) {
      // key like "/react@18.2.0"
      const m = key.match(/^\/(.+?)@(.+)$/);
      if (m) {
        const name = m[1];
        const version = meta?.version ?? m[2];
        if (name && version) npmPackages.set(name, version);
      }
    }
  } else if (pkgJson?.content) {
    const json = JSON.parse(pkgJson.content);
    const deps = { ...(json.dependencies ?? {}), ...(json.devDependencies ?? {}) } as Record<string, string>;
    for (const [name, range] of Object.entries(deps)) {
      const cleaned = range.replace(/^[^0-9]*/, '');
      if (cleaned) npmPackages.set(name, cleaned);
    }
  }

  const queries: any[] = [];
  for (const [name, version] of npmPackages) {
    queries.push({ package: { ecosystem: 'npm', name }, version });
  }

  const findings: VulnFinding[] = [];
  if (queries.length) {
    const resp = await fetch('https://api.osv.dev/v1/querybatch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ queries })
    });
    if (resp.ok) {
      const data: any = await resp.json();
      const results = data.results ?? [];
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (res.vulns?.length) {
          const { name, version } = queries[i].package;
          for (const v of res.vulns) {
            findings.push({ package: name, version: queries[i].version, ecosystem: 'npm', ids: v.aliases ?? v.id ? [v.id] : [], summary: v.summary });
          }
        }
      }
    }
  }

  const affected = Array.from(new Set(findings.map(f => `${f.package}@${f.version}`))).map(x => {
    const [name, version] = x.split('@');
    return { name, version, ecosystem: 'npm' as const };
  });

  return { totalFindings: findings.length, affectedPackages: affected, findings };
}


