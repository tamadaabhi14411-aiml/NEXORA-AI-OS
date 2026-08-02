import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/agent/chat",
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
            "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
    setMessage("");
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
              textAlign:
                msg.sender === "user"
                  ? "right"
                  : "left",
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
          placeholder="Ask Chief AI..."
          onChange={(e) => setMessage(e.target.value)}
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
          style={{
            padding: "12px 25px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}