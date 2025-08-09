"use client"

import { useState } from "react"
import { ChevronDown, Wrench, Plus, MessageSquare } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { navigationItems, maintenanceItems } from "../constants/navigation"

interface SidebarNavProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  const [maintenanceOpen, setMaintenanceOpen] = useState(false)

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl font-bold text-primary">Patchly</div>
        </div>
        
        {/* New Chat Button */}
        <Button
          onClick={() => onViewChange('chat')}
          className="w-full justify-start gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
        >
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 p-4 space-y-2 overflow-auto">
        <div className="text-xs text-sidebar-foreground/60 mb-2 px-2">Today</div>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50 h-auto p-3"
          onClick={() => onViewChange('chat')}
        >
          <MessageSquare size={16} />
          <div className="flex-1 text-left">
            <div className="text-sm truncate">Generate README.md</div>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50 h-auto p-3"
          onClick={() => onViewChange('chat')}
        >
          <MessageSquare size={16} />
          <div className="flex-1 text-left">
            <div className="text-sm truncate">Security vulnerability scan</div>
          </div>
        </Button>

        <div className="text-xs text-sidebar-foreground/60 mb-2 px-2 mt-6">Yesterday</div>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50 h-auto p-3"
          onClick={() => onViewChange('chat')}
        >
          <MessageSquare size={16} />
          <div className="flex-1 text-left">
            <div className="text-sm truncate">License compatibility check</div>
          </div>
        </Button>

        <div className="border-t border-sidebar-border mt-6 pt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 mb-1 ${
                  activeView === item.id 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </Button>
            )
          })}

          {/* Maintenance Collapsible */}
          <Collapsible open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <div className="flex items-center gap-3">
                  <Wrench size={18} />
                  Maintenance
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform ${maintenanceOpen ? "rotate-180" : ""}`} 
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-2 space-y-1">
              {maintenanceItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 text-sm ${
                      activeView === item.id 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Button>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 cursor-pointer transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">S</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-sidebar-foreground truncate">Srujan R Kumar</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">srujan@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}