import { useState, useEffect } from "react";
import API from "../api/api";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await API.get("/agent/history");

      if (response.data.messages) {
        const history = [];

        response.data.messages.forEach((item) => {
          history.push({
            sender: "user",
            text: item.message,
          });

          history.push({
            sender: "ai",
            text: item.reply,
          });
        });

        setMessages(history);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/agent/chat", {
        message: currentMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            error.response?.data?.message ||
            "Unable to contact NEXORA AI.",
        },
      ]);
    }

    setLoading(false);
  };

  const clearChat = async () => {
    try {
      await API.delete("/agent/history");
      setMessages([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1>🤖 NEXORA Chief AI</h1>

      <div
        style={{
          marginTop: "20px",
          height: "65vh",
          overflowY: "auto",
          border: "1px solid #444",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: "20px",
            }}
          >
            <b>
              {msg.sender === "user"
                ? "You"
                : "Chief AI"}
            </b>

            <div
              style={{
                marginTop: "8px",
                display: "inline-block",
                background:
                  msg.sender === "user"
                    ? "#2563eb"
                    : "#1f2937",
                padding: "12px",
                borderRadius: "10px",
                maxWidth: "70%",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p>
            <b>Chief AI:</b> Thinking...
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={message}
          placeholder="Ask NEXORA..."
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "12px 25px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>

        <button
          onClick={clearChat}
          style={{
            padding: "12px 20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}