import React, { useState } from 'react';

type Docs = { readme: string; contributing: string };

export default function App() {
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<Docs | null>(null);
  const [scan, setScan] = useState<any | null>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);

  async function callApi<T>(path: string, body: any): Promise<T> {
    const r = await fetch(`http://localhost:4000${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json() as any;
  }

  async function onScan() {
    setLoading(true);
    setScan(null);
    try {
      const res = await callApi<{ ok: boolean; vulns: any; license: any }>(`/api/scan`, { repo });
      setScan(res);
    } finally {
      setLoading(false);
    }
  }

  async function onGenerateDocs() {
    setLoading(true);
    setDocs(null);
    try {
      const res = await callApi<{ ok: boolean; readme: string; contributing: string }>(`/api/docs/generate`, { repo });
      setDocs({ readme: res.readme, contributing: res.contributing });
    } finally {
      setLoading(false);
    }
  }

  async function onOpenPr() {
    if (!docs) return;
    setLoading(true);
    setPrUrl(null);
    try {
      const res = await callApi<{ ok: boolean; url: string }>(`/api/pr/docs`, { repo, branch: 'patchly/docs', readme: docs.readme, contributing: docs.contributing });
      setPrUrl(res.url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Patchly</h1>
      <p>Prepare your GitHub repository for open source.</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input placeholder="owner/repo" value={repo} onChange={(e) => setRepo(e.target.value)} style={{ flex: 1, padding: 8 }} />
        <button onClick={onScan} disabled={!repo || loading}>Scan</button>
        <button onClick={onGenerateDocs} disabled={!repo || loading}>Generate Docs</button>
        <button onClick={onOpenPr} disabled={!docs || loading}>Open PR</button>
      </div>

      {loading && <p>Working…</p>}

      {scan && (
        <div style={{ marginTop: 24 }}>
          <h2>Scan</h2>
          <pre style={{ background: '#f6f6f6', padding: 12, overflow: 'auto' }}>{JSON.stringify(scan, null, 2)}</pre>
        </div>
      )}

      {docs && (
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h2>README.md</h2>
            <textarea value={docs.readme} onChange={(e) => setDocs({ ...docs, readme: e.target.value })} rows={20} style={{ width: '100%' }} />
          </div>
          <div>
            <h2>CONTRIBUTING.md</h2>
            <textarea value={docs.contributing} onChange={(e) => setDocs({ ...docs, contributing: e.target.value })} rows={20} style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {prUrl && (
        <p style={{ marginTop: 16 }}>PR opened: <a href={prUrl} target="_blank" rel="noreferrer">{prUrl}</a></p>
      )}
    </div>
  );
}


