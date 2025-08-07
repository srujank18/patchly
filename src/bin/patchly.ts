#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { loadConfig } from '../config.js';
import { generateDocs } from '../generators/readme.js';
import { generateContributing } from '../generators/contributing.js';
import { scanVulnerabilities } from '../scanners/vulns.js';
import { analyzeProjectLicense } from '../scanners/licenses.js';
import { createDocsPullRequest } from '../pr/createPr.js';

const program = new Command();
program
  .name('patchly')
  .description('Patchly CLI — make repos production-ready OSS')
  .version('0.1.0');

program
  .command('generate-docs')
  .description('Generate README and CONTRIBUTING and open a PR')
  .option('-r, --repo <owner/name>', 'GitHub repo, e.g. vercel/next.js')
  .option('-b, --branch <name>', 'Branch name for PR', 'patchly/docs')
  .action(async (opts) => {
    const cfg = await loadConfig({ repoOverride: opts.repo });
    if (!cfg.repo) {
      console.error('Missing repo. Pass --repo or set in patchly.config.json');
      process.exit(1);
    }
    const [readme, contributing] = await Promise.all([
      generateDocs(cfg),
      generateContributing(cfg)
    ]);
    const prUrl = await createDocsPullRequest({ config: cfg, branch: opts.branch, readme, contributing });
    console.log(`Opened PR: ${prUrl}`);
  });

program
  .command('scan')
  .description('Scan for vulnerabilities and license info')
  .option('-r, --repo <owner/name>', 'GitHub repo, e.g. vercel/next.js')
  .option('-f, --format <format>', 'Output format: text|json', 'text')
  .action(async (opts) => {
    const cfg = await loadConfig({ repoOverride: opts.repo });
    if (!cfg.repo) {
      console.error('Missing repo. Pass --repo or set in patchly.config.json');
      process.exit(1);
    }
    const [vulnReport, licenseReport] = await Promise.all([
      scanVulnerabilities(cfg),
      analyzeProjectLicense(cfg)
    ]);
    const report = { vulnerabilities: vulnReport, license: licenseReport };
    if (opts.format === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`# Vulnerabilities: ${vulnReport.totalFindings}`);
      console.log(`Affected packages: ${vulnReport.affectedPackages.length}`);
      console.log(`# License: ${licenseReport.projectLicense ?? 'unknown'}`);
      if (licenseReport.issues.length) {
        console.log('License issues:');
        for (const issue of licenseReport.issues) console.log(`- ${issue}`);
      }
    }
  });

program.parseAsync();


