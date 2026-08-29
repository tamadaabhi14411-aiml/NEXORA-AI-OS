import ChatMessage from "./ChatMessage";

function ChatWindow({ messages, sending }) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto py-6">
      {messages.length === 0 && !sending && (
        <div className="flex h-full items-center justify-center text-center">
          <div>
            <p className="text-lg font-medium text-zinc-300">
              Start a conversation
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Ask NEXORA AI anything.
            </p>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <ChatMessage
          key={message.id || message._id || index}
          sender={
            message.sender ||
            message.role ||
            (message.user ? "user" : "ai")
          }
          text={
            message.text ||
            message.content ||
            message.message ||
            message.response ||
            ""
          }
        />
      ))}

      {sending && (
        <ChatMessage
          sender="ai"
          text="NEXORA AI is thinking..."
        />
      )}
    </div>
  );
}

export default ChatWindow;
