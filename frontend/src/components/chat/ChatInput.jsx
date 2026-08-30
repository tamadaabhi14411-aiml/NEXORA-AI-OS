import { useState } from "react";
import { SendHorizontal } from "lucide-react";

function ChatInput({ onSend, sending }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  };

  return (
    <div className="border-t border-zinc-800 pt-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-3"
      >
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message NEXORA AI..."
          disabled={sending}
          className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal size={18} />
        </button>
      </form>

      {sending && (
        <p className="mt-2 text-center text-xs text-zinc-500">
          NEXORA AI is generating a response...
        </p>
      )}
    </div>
  );
}

export default ChatInput;
