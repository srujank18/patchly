Patchly Web (Monorepo)

Full-stack TypeScript app that helps prepare GitHub repos for open source.

Apps

- apps/server: Express API (Octokit, OSV.dev, OpenAI, SPDX)
- apps/web: React + Vite UI

Getting Started

1. Copy `.env.example` to `.env` inside `apps/server` and fill:
   - GH_TOKEN
   - OPENAI_API_KEY
2. Install dependencies at repo root:

```
npm i
```

3. Run dev (starts server and web in parallel):

```
npm run dev
```

Server runs on http://localhost:4000, Web on http://localhost:5173.

Notes

- All endpoints are placeholders but wired with types and request/response shapes.
- Replace the placeholder logic with real implementations as you add tokens and scopes.
Patchly (MVP)

Turn your codebase into a production-ready open source project. Generate docs, scan vulnerabilities, and open PRs.

Quickstart

1. Clone this repo or copy this `patchly` folder into your workspace
2. Install deps

```
pnpm i # or npm i / yarn
```

3. Configure environment

Create `.env` from `.env.example` and set:

- GH_TOKEN: GitHub token with repo scope
- OPENAI_API_KEY: OpenAI API key

4. Configure repo target in `patchly.config.json`

Usage

```
pnpm build
npx node dist/bin/patchly.js generate-docs --repo owner/name
npx node dist/bin/patchly.js scan --repo owner/name --format json
```

Commands

- generate-docs: Generates README and CONTRIBUTING with AI and opens a PR
- scan: Scans for known vulnerabilities (OSV) and reports project license

Notes

- This is an MVP. License conflict checks are minimal; future versions will build a full SBOM and SPDX analysis. 
- Only Node/npm ecosystems are scanned right now.

