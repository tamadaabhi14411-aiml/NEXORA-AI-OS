import { SendHorizontal } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Chat() {
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-112px)] flex-col">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold">
            AI Assistant
          </h1>

          <p className="mt-2 text-zinc-400">
            Ask anything. Learn faster. Build smarter.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Start a conversation
            </h2>

            <p className="mt-3 text-zinc-500">
              Your AI assistant is ready.
            </p>
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t border-zinc-800 pt-6">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
            <input
              type="text"
              placeholder="Message NEXORA AI..."
              className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
            />

            <button
              className="rounded-xl bg-blue-600 p-3 transition hover:bg-blue-700"
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Chat;