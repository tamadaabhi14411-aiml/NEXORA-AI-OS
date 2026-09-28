import api from "./api";

const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

const signup = async ({ name, email, password }) => {
  const response = await api.post("/auth/register", {
    fullName: name,
    email,
    password,
  });

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