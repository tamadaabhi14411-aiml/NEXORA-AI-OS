import DashboardLayout from "../../layouts/DashboardLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";

function Chat() {
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-112px)] flex-col">
        <ChatHeader />

        <ChatWindow />

        <ChatInput />
      </div>
    </DashboardLayout>
  );
}

export default Chat;