import { Plus } from "lucide-react";

function ChatHeader({ onNewConversation, loading }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
      <div>
        <h1 className="text-3xl font-bold">
          AI Assistant
        </h1>

        <p className="mt-2 text-zinc-400">
          Chat with your personal AI assistant.
        </p>
      </div>

      <button
        type="button"
        onClick={onNewConversation}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={18} />
        New Conversation
      </button>
    </div>
  );
}

export default ChatHeader;
