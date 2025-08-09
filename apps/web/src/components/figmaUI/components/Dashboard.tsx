import { Search, Paperclip, Github, Plus } from "lucide-react"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { suggestedPrompts, contributors, todoItems } from "../constants/mockData"

export function Dashboard() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="text-4xl font-bold text-primary">Patchly</div>
          </div>
          <h1 className="text-4xl mb-4 text-foreground">Hi Srujan, how can I help you today?</h1>
          <p className="text-lg text-muted-foreground">Turn your codebase into a production-ready open source project</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Input
                placeholder="Ask Patchly anything about your project..."
                className="pl-6 pr-16 py-4 text-base rounded-full bg-card border border-border focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
                  <Paperclip size={16} className="text-muted-foreground" />
                </Button>
                <Button size="icon" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {suggestedPrompts.map((prompt, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border/50 hover:border-border bg-card/50 hover:bg-card">
                <CardContent className="p-6">
                  <p className="text-sm text-card-foreground leading-relaxed">{prompt.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Contributors Card */}
          <Card className="bg-card border border-border/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Contributors</CardTitle>
              <Github className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {contributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={contributor.avatar} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-card-foreground">{contributor.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{contributor.contributions}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-card border border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-1 text-card-foreground">0</div>
              <div className="text-sm text-muted-foreground">Open PRs</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-1 text-card-foreground">0</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-card border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todoItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-card-foreground leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}