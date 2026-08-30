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

const chatService = {
  sendMessage,
  getHistory,
};

export default chatService;