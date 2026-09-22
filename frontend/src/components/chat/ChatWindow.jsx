import ChatMessage from "./ChatMessage";

const starterPrompts = [
  "Create a study plan",
  "Explain code",
  "Help with my project",
  "Improve my resume",
  "Find a skill to learn",
];

function ChatWindow({
  messages,
  sending,
  onStarterPrompt,
}) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto py-6">
      {messages.length === 0 && !sending && (
        <div className="flex h-full items-center justify-center text-center">
          <div className="max-w-2xl">
            <p className="text-2xl font-bold text-white">
              What do you want to achieve?
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Ask NEXORA AI for help with learning,
              coding, projects, career, or productivity.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() =>
                    onStarterPrompt(prompt)
                  }
                  disabled={sending}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 transition hover:border-blue-500 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <ChatMessage
          key={
            message.id ||
            message._id ||
            index
          }
          sender={
            message.sender ||
            message.role ||
            (message.user
              ? "user"
              : "ai")
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