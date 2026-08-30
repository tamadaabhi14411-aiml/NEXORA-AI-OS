import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";
import ConversationHistory from "../../components/chat/ConversationHistory";
import chatService from "../../services/chatService";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const [historyLoading, setHistoryLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Load conversation history
  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setError("");

      const data = await chatService.getHistory();

      console.log("HISTORY RESPONSE:", data);

      const history = Array.isArray(data)
        ? data
        : data?.history || data?.data || data?.conversations || [];

      const validConversations = history.filter(
        (conversation) => conversation?._id
      );

      setConversations(validConversations);
    } catch (error) {
      console.error("History error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status >= 500) {
        setError("The AI backend is currently unavailable.");
      } else if (error.request) {
        setError("Unable to connect to the AI backend.");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load conversation history."
        );
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  // Open one conversation
  const handleSelectConversation = async (conversation) => {
    const conversationId = conversation?._id;

    if (!conversationId) {
      setError("Conversation ID is missing.");
      return;
    }

    try {
      setSelectedConversationId(conversationId);
      setConversationLoading(true);
      setError("");
      setMessages([]);

      console.log("OPENING CONVERSATION ID:", conversationId);

      const data = await chatService.getConversation(conversationId);

      console.log("CONVERSATION RESPONSE:", data);

      const conversationData = data?.data;

      if (!conversationData) {
        setError("Conversation data was not found.");
        return;
      }

      const formattedMessages = (conversationData.messages || []).map(
        (message, index) => ({
          id: `${conversationData._id}-${index}`,
          sender:
            message.role === "assistant"
              ? "ai"
              : "user",
          text: message.content || "",
        })
      );

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Open conversation error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status === 404) {
        setError("Conversation not found.");
      } else if (error.response?.status >= 500) {
        setError("The AI backend is currently unavailable.");
      } else if (error.request) {
        setError("Unable to connect to the AI backend.");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load conversation."
        );
      }
    } finally {
      setConversationLoading(false);
    }
  };

  // New conversation
  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setError("");
  };

  // Send message
  const handleSendMessage = async (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const userMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: trimmedMessage,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        userMessage,
      ]);

      const data = await chatService.sendMessage(trimmedMessage);

      console.log("CHAT RESPONSE:", data);

      const assistantContent =
        data?.data?.message ||
        data?.data?.response ||
        data?.data?.reply ||
        data?.data?.answer ||
        data?.data?.content ||
        data?.message ||
        data?.response ||
        data?.reply ||
        data?.answer ||
        data?.content;

      if (!assistantContent) {
        throw new Error(
          "No response received from NEXORA AI."
        );
      }

      const assistantMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text:
          typeof assistantContent === "string"
            ? assistantContent
            : JSON.stringify(assistantContent),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      // Refresh history so the latest conversation appears
      await loadHistory();
    } catch (error) {
      console.error("Send message error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status === 404) {
        setError("Chat endpoint not found.");
      } else if (error.response?.status >= 500) {
        setError("The AI backend is currently unavailable.");
      } else if (error.request) {
        setError("Unable to connect to the AI backend.");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to send message."
        );
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-112px)] flex-col">
        <ChatHeader
          onNewConversation={handleNewConversation}
        />

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-800">
          {/* Conversation History */}
          <div className="w-72 shrink-0">
            <ConversationHistory
              conversations={conversations}
              loading={historyLoading}
              selectedId={selectedConversationId}
              onSelect={handleSelectConversation}
            />
          </div>

          {/* Chat */}
          <div className="flex min-w-0 flex-1 flex-col px-4">
            {conversationLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                Loading conversation...
              </div>
            ) : (
              <>
                <ChatWindow
                  messages={messages}
                  sending={sending}
                />

                <ChatInput
                  onSend={handleSendMessage}
                  sending={sending}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Chat;
