import { Bot, User } from "lucide-react";

function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl gap-4 rounded-2xl p-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-900 text-white"
        }`}
      >
        {/* Avatar */}
        <div className="mt-1">
          {isUser ? (
            <User size={22} />
          ) : (
            <Bot size={22} />
          )}
        </div>

        {/* Message */}
        <div>
          <h3 className="font-semibold">
            {isUser ? "You" : "NEXORA AI"}
          </h3>

          <p className="mt-2 leading-7">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;