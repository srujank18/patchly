import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isUser: boolean
  isThinking?: boolean
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`group flex gap-4 ${message.isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {message.isUser ? (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">S</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="text-sm font-bold text-primary">P</div>
          </div>
        )}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 ${message.isUser ? "max-w-[80%]" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-foreground">{message.sender}</span>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>
        
        <div className={`prose prose-sm max-w-none ${
          message.isUser 
            ? "bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-md" 
            : message.isThinking
            ? "text-muted-foreground italic p-4 bg-muted/30 rounded-2xl"
            : "text-card-foreground"
        }`}>
          {message.isThinking ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              </div>
              {message.content}
            </div>
          ) : (
            <div className={`whitespace-pre-wrap leading-relaxed ${
              message.isUser ? "text-primary-foreground" : "text-foreground"
            }`}>
              {message.content.split('\n').map((line, i) => (
                <div key={i}>
                  {line.startsWith('## ') ? (
                    <h3 className={`mt-4 mb-2 ${message.isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {line.replace('## ', '')}
                    </h3>
                  ) : line.startsWith('- ') ? (
                    <div className={`ml-4 ${message.isUser ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                      {line.replace('- ', '• ')}
                    </div>
                  ) : (
                    line || <br />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}