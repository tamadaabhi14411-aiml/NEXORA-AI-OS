import { SendHorizontal } from "lucide-react";

function ChatInput() {
  return (
    <div className="border-t border-zinc-800 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
        <input
          type="text"
          placeholder="Message NEXORA AI..."
          className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
        />

        <button
          type="button"
          className="rounded-xl bg-blue-600 p-3 transition hover:bg-blue-700"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;