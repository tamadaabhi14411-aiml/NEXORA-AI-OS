import api from "./api";

const sendMessage = async (message) => {
  const response = await api.post(
    "/agent/chat",
    {
      message,
    },
    {
      timeout: 60000,
    }
  );

  return response.data;
};

const getHistory = async () => {
  const response = await api.get("/agent/history");

  return response.data;
};

const getConversation = async (conversationId) => {
  const response = await api.get(
    `/agent/history/${conversationId}`
  );

  return response.data;
};

const chatService = {
  sendMessage,
  getHistory,
  getConversation,
};

export default chatService;