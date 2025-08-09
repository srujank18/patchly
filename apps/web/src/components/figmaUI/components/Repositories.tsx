import { Search, GitBranch, Star, GitFork } from "lucide-react"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { repositories } from "../constants/mockData"

export function Repositories() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Repositories</h1>
          <p className="text-muted-foreground">Manage and analyze your connected repositories</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search repositories..."
              className="pl-12 py-3 rounded-xl bg-card border border-border/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-border bg-card/50 hover:bg-card cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className={`w-12 h-12 ${repo.avatarBg} flex-shrink-0`}>
                    <AvatarFallback className={`${repo.avatarBg} text-white font-medium text-lg`}>
                      {repo.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {repo.lastUpdated}
                    </p>
                  </div>
                </div>
                
                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={14} />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch size={14} />
                    <span>main</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      TypeScript
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Healthy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Showing 5 of 66 repositories
          </p>
        </div>
      </div>
    </div>
  )
}