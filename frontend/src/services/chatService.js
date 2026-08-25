import api from "./api";

const chatService = {
  sendMessage: async (message) => {
    const response = await api.post("/chat", {
      message,
    });

    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/history");

    return response.data;
  },

  deleteHistory: async () => {
    const response = await api.delete("/history");

    return response.data;
  },
};

export default chatService;