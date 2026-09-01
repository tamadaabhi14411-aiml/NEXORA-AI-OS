import api from "./api";

const analyzeResume = async (company, role) => {
  const response = await api.post("/resume/analyze", {
    company,
    role,
  });

  return response.data;
};

const generateResume = async (company, role) => {
  const response = await api.post("/resume/generate", {
    company,
    role,
  });

  return response.data;
};

const resumeService = {
  analyzeResume,
  generateResume,
};

export default resumeService;