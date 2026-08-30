import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";
import chatService from "../../services/chatService";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setError("");

        const data = await chatService.getHistory();

        const history = Array.isArray(data)
          ? data
          : data.history || data.conversations || data.messages || [];

        setMessages(history);
      } catch (error) {
        console.error("Chat history error:", error);

        if (error.response?.status === 401) {
          setError("Your session has expired. Please login again.");
        } else if (error.response?.status === 404) {
          setError("Chat history endpoint was not found.");
        } else if (error.response?.status >= 500) {
          setError("The AI backend is currently unavailable.");
        } else if (error.request) {
          setError("Unable to connect to the AI backend.");
        } else {
          setError("Unable to load chat history.");
        }
      }
    };

    loadHistory();
  }, []);

  const handleSendMessage = async (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

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

    try {
      setSending(true);

      const data = await chatService.sendMessage(trimmedMessage);

      const aiText =
        data.response ||
        data.message ||
        data.reply ||
        data.answer ||
        data.content;

      if (!aiText) {
        throw new Error("AI response was empty.");
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status === 404) {
        setError("AI chat endpoint was not found.");
      } else if (error.response?.status >= 500) {
        setError("The AI backend is currently unavailable.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("Unable to connect to the AI backend.");
      } else {
        setError(error.message || "Failed to get AI response.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-112px)] flex-col">
        <ChatHeader />

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <ChatWindow
          messages={messages}
          sending={sending}
        />

        <ChatInput
          onSend={handleSendMessage}
          sending={sending}
        />
      </div>
    </DashboardLayout>
  );
}

export default Chat;
