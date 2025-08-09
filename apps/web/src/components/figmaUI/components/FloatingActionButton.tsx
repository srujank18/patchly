import { Play, Zap } from "lucide-react"
import { Button } from "./ui/button"

export function FloatingActionButton() {
  return (
    <div className="fixed left-80 bottom-8 z-50">
      <Button 
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl rounded-2xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-2xl hover:scale-105 border border-primary/20"
        onClick={() => {
          console.log("Run Agent clicked")
        }}
      >
        <Zap size={16} className="mr-2" />
        Run Agent
      </Button>
    </div>
  )
}