import api from "./api";

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

const authService = {
  login,
  signup,
  getProfile,
};

export default authService;