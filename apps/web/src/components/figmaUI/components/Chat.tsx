import { useState } from "react"
import { Send, Paperclip, Plus } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ChatMessage } from "./ChatMessage"

interface ChatProps {
  messages: any[]
  onSendMessage: (message: string) => void
}

export function Chat({ messages, onSendMessage }: ChatProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto px-6">
            <div className="mb-8">
              <div className="h-16 mx-auto mb-6 flex items-center justify-center">
                <div className="text-4xl font-bold text-primary">P</div>
              </div>
              <h1 className="text-3xl mb-4 text-center text-foreground">How can I help you today?</h1>
              <p className="text-center text-muted-foreground">
                I can help you turn your codebase into a production-ready open source project
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              <Button
                variant="outline"
                className="h-auto p-4 text-left justify-start bg-card hover:bg-card/80 border-border/50"
              >
                <div>
                  <div className="font-medium mb-1">Analyze my repository</div>
                  <div className="text-sm text-muted-foreground">Get a comprehensive analysis of your codebase</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left justify-start bg-card hover:bg-card/80 border-border/50"
              >
                <div>
                  <div className="font-medium mb-1">Generate documentation</div>
                  <div className="text-sm text-muted-foreground">Create README, CONTRIBUTING, and API docs</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left justify-start bg-card hover:bg-card/80 border-border/50"
              >
                <div>
                  <div className="font-medium mb-1">Security scan</div>
                  <div className="text-sm text-muted-foreground">Check for vulnerabilities and security issues</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left justify-start bg-card hover:bg-card/80 border-border/50"
              >
                <div>
                  <div className="font-medium mb-1">License review</div>
                  <div className="text-sm text-muted-foreground">Analyze license compatibility and conflicts</div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="relative">
            <Input
              placeholder="Message Patchly..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-4 pr-20 py-4 text-base rounded-3xl bg-card border border-border focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
                <Paperclip size={16} className="text-muted-foreground" />
              </Button>
              <Button size="icon" className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90" onClick={handleSend}>
                <Send size={16} />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Patchly can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}