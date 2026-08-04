import ChatMessage from "./ChatMessage";

const messages = [
  {
    id: 1,
    sender: "ai",
    text: "Hello! 👋 Welcome to NEXORA AI OS. How can I help you today?",
  },
  {
    id: 2,
    sender: "user",
    text: "Can you create a React dashboard UI?",
  },
  {
    id: 3,
    sender: "ai",
    text: "Absolutely! I can help you build a premium dashboard using React, Tailwind CSS, Framer Motion, and reusable components.",
  },
];

function ChatWindow() {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto py-6">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          sender={message.sender}
          text={message.text}
        />
      ))}
    </div>
  );
}

export default ChatWindow;