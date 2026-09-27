import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";
import ConversationHistory from "../../components/chat/ConversationHistory";

import chatService from "../../services/chatService";
import aiProvider from "../../services/aiProvider";

// --------------------------------------------------
// DAY 12 PRODUCTION AI PROVIDER
// --------------------------------------------------
// NEXORA AI uses:
// 1. Existing backend AI first
// 2. Puter AI as fallback if backend fails
//
// Provider remains invisible to the user.
// --------------------------------------------------

const AI_PROVIDER = aiProvider.PROVIDERS.AUTO;

function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] =
    useState(null);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  const [conversationLoading, setConversationLoading] =
    useState(false);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD CONVERSATION HISTORY
  // --------------------------------------------------

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setError("");

      const data = await chatService.getHistory();

      console.log("HISTORY RESPONSE:", data);

      const history = Array.isArray(data)
        ? data
        : data?.history ||
          data?.data ||
          data?.conversations ||
          [];

      const validConversations = history.filter(
        (conversation) => conversation?._id
      );

      setConversations(validConversations);
    } catch (error) {
      console.error("History error:", error);

      if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (error.response?.status >= 500) {
        setError(
          "The AI backend is currently unavailable."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the AI backend."
        );
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

  // --------------------------------------------------
  // SELECT EXISTING CONVERSATION
  // --------------------------------------------------

  const handleSelectConversation = async (
    conversation
  ) => {
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

      console.log(
        "OPENING CONVERSATION:",
        conversation
      );

      // History API already provides messages.
      const conversationData = conversation;

      if (!conversationData?.messages) {
        setError(
          "Conversation messages were not found."
        );
        return;
      }

      const formattedMessages =
        conversationData.messages.map(
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
      console.error(
        "Open conversation error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (error.response?.status === 404) {
        setError("Conversation not found.");
      } else if (error.response?.status >= 500) {
        setError(
          "The AI backend is currently unavailable."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the AI backend."
        );
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

  // --------------------------------------------------
  // NEW CONVERSATION
  // --------------------------------------------------

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setError("");
  };

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const handleSendMessage = async (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      // ----------------------------------------------
      // USER MESSAGE
      // ----------------------------------------------

      const userMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: trimmedMessage,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        userMessage,
      ]);

      // ----------------------------------------------
      // SEND TO NEXORA AI PROVIDER
      // ----------------------------------------------

      console.log(
        "ACTIVE AI PROVIDER:",
        AI_PROVIDER
      );

      const result = await aiProvider.sendMessage(
        trimmedMessage,
        AI_PROVIDER
      );

      console.log(
        "AI PROVIDER RESPONSE:",
        result
      );

      // ----------------------------------------------
      // GET ACTUAL AI RESPONSE
      // ----------------------------------------------

      const assistantContent =
        result?.data?.data?.reply ||
        result?.data?.data?.conversation?.reply ||
        result?.data?.reply ||
        result?.data?.conversation?.reply ||
        result?.data?.response ||
        result?.data?.answer ||
        result?.data?.content ||
        result?.message;

      console.log(
        "ACTUAL AI RESPONSE:",
        assistantContent
      );

      if (!assistantContent) {
        throw new Error(
          "No response received from NEXORA AI."
        );
      }

      // ----------------------------------------------
      // AI MESSAGE
      // ----------------------------------------------

      const assistantMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",

        text:
          typeof assistantContent === "string"
            ? assistantContent
            : JSON.stringify(
                assistantContent
              ),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      // ----------------------------------------------
      // REFRESH HISTORY
      // ----------------------------------------------
      //
      // Backend AI supports history.
      // Puter fallback currently does not.
      // ----------------------------------------------

      if (result?.historySupported) {
        await loadHistory();
      }
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      setError(
        error.message ||
          "NEXORA AI is temporarily unable to respond. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadHistory();
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-112px)] flex-col">

        {/* ------------------------------------------ */}
        {/* CHAT HEADER */}
        {/* ------------------------------------------ */}

        <ChatHeader
          onNewConversation={
            handleNewConversation
          }
        />

        {/* ------------------------------------------ */}
        {/* ERROR MESSAGE */}
        {/* ------------------------------------------ */}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* MAIN CHAT CONTAINER */}
        {/* ------------------------------------------ */}

        <div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-800">

          {/* ---------------------------------------- */}
          {/* CONVERSATION HISTORY */}
          {/* ---------------------------------------- */}

          <div className="w-72 shrink-0">
            <ConversationHistory
              conversations={conversations}
              loading={historyLoading}
              selectedId={selectedConversationId}
              onSelect={
                handleSelectConversation
              }
            />
          </div>

          {/* ---------------------------------------- */}
          {/* CHAT AREA */}
          {/* ---------------------------------------- */}

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
                  onStarterPrompt={
                    handleSendMessage
                  }
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