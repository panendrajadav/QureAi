interface ChatMessageProps {
  message: {
    id: number
    type: "user" | "ai"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-xl px-4 py-3 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  )
}
