"use client"

import { useState } from "react"
import { SidebarNav } from "./components/SidebarNav"
import { Dashboard } from "./components/Dashboard"
import { Repositories } from "./components/Repositories"
import { Chat } from "./components/Chat"
import { LicenseView } from "./components/LicenseView"
import { FloatingActionButton } from "./components/FloatingActionButton"

type Docs = { readme: string; contributing: string };

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [repo, setRepo] = useState('')
  const [loading, setLoading] = useState(false)
  const [docs, setDocs] = useState<Docs | null>(null)
  const [scan, setScan] = useState<any | null>(null)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])

  async function callApi<T>(path: string, body: any): Promise<T> {
    const r = await fetch(`/api${path}`, { 
      method: 'POST', 
      headers: { 'content-type': 'application/json' }, 
      body: JSON.stringify(body) 
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json() as any;
  }

  async function onScan() {
    setLoading(true);
    setScan(null);
    try {
      const res = await callApi<{ ok: boolean; vulns: any; license: any }>(`/scan`, { repo });
      setScan(res);
      // Add message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "Patchly",
        content: `Scan completed for ${repo}. Found ${res.vulns?.length || 0} vulnerabilities and license information.`,
        timestamp: "Just now",
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function onGenerateDocs() {
    setLoading(true);
    setDocs(null);
    try {
      const res = await callApi<{ ok: boolean; readme: string; contributing: string }>(`/docs/generate`, { repo });
      setDocs({ readme: res.readme, contributing: res.contributing });
      // Add message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "Patchly",
        content: `Documentation generated for ${repo}. README and CONTRIBUTING files are ready.`,
        timestamp: "Just now",
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function onOpenPr() {
    if (!docs) return;
    setLoading(true);
    setPrUrl(null);
    try {
      const res = await callApi<{ ok: boolean; url: string }>(`/pr/docs`, { 
        repo, 
        branch: 'patchly/docs', 
        readme: docs.readme, 
        contributing: docs.contributing 
      });
      setPrUrl(res.url);
      // Add message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "Patchly",
        content: `Pull request created: ${res.url}`,
        timestamp: "Just now",
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  }

  const handleChatMessage = async (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: "You",
      content: message,
      timestamp: "Just now",
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "Patchly",
        content: "I understand you're asking about: " + message + ". Let me help you with that.",
        timestamp: "Just now",
        isUser: false
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'chat':
        return <Chat messages={messages} onSendMessage={handleChatMessage} />
      case 'repositories':
        return <Repositories />
      case 'documentation':
        return <LicenseView />
      case 'issues':
        return (
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-foreground mb-4">Issues</h1>
            <p className="text-muted-foreground">Manage and track project issues here.</p>
          </div>
        )
      case 'contributors':
        return (
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-foreground mb-4">Contributors</h1>
            <p className="text-muted-foreground">View and manage project contributors.</p>
          </div>
        )
      case 'analysis':
        return (
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-foreground mb-4">Analysis</h1>
            <p className="text-muted-foreground">Project analytics and insights.</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <SidebarNav activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderActiveView()}
      </main>
      <FloatingActionButton />
    </div>
  )
}