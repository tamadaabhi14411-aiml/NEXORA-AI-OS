function ConversationHistory({
  conversations,
  loading,
  selectedId,
  onSelect,
}) {
  if (loading) {
    return (
      <div className="p-4 text-sm text-zinc-500">
        Loading conversation history...
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="p-4 text-sm text-zinc-500">
        No conversations yet.
      </div>
    );
  }

  const getConversationId = (conversation) => {
    return (
      conversation?._id ||
      conversation?.conversationId ||
      conversation?.id ||
      null
    );
  };

  const getConversationTitle = (conversation) => {
    if (conversation?.title) {
      return conversation.title;
    }

    if (Array.isArray(conversation?.messages)) {
      const firstUserMessage = conversation.messages.find(
        (message) => message?.role === "user"
      );

      if (firstUserMessage?.content) {
        return firstUserMessage.content;
      }
    }

    if (conversation?.message) {
      return conversation.message;
    }

    return "New conversation";
  };

  const getConversationDate = (conversation) => {
    return (
      conversation?.updatedAt ||
      conversation?.createdAt ||
      conversation?.date ||
      null
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-4 py-4">
        <h2 className="text-sm font-semibold text-white">
          Conversations
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.map((conversation, index) => {
          const conversationId = getConversationId(conversation);
          const title = getConversationTitle(conversation);
          const date = getConversationDate(conversation);

          return (
            <button
              key={conversationId || `conversation-${index}`}
              type="button"
              disabled={!conversationId}
              onClick={() => {
                if (conversationId) {
                  onSelect(conversation, conversationId);
                }
              }}
              className={`mb-1 w-full rounded-lg p-3 text-left transition ${
                selectedId === conversationId
                  ? "bg-blue-600/20 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              } ${
                !conversationId
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <p className="truncate text-sm font-medium">
                {title}
              </p>

              {date && (
                <p className="mt-1 text-xs text-zinc-600">
                  {new Date(date).toLocaleString()}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ConversationHistory;
