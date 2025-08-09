import { MessageSquare, BarChart3, Wrench, FileText, AlertCircle, Users, Settings } from "lucide-react"

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'analysis', label: 'Analysis', icon: BarChart3 },
]

export const maintenanceItems = [
  { id: 'documentation', label: 'Documentation', icon: FileText },
  { id: 'issues', label: 'Issues', icon: AlertCircle },
  { id: 'contributors', label: 'Contributors', icon: Users },
  { id: 'repositories', label: 'Repositories', icon: Settings },
]