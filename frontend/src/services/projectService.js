const PROJECT_API_UNAVAILABLE =
  "Project APIs are not available on the current backend.";

const unavailable = () => {
  throw new Error(PROJECT_API_UNAVAILABLE);
};

const projectService = {
  async getProjects() {
    return unavailable();
  },

  async getProject() {
    return unavailable();
  },

  async createProject() {
    return unavailable();
  },

  async joinProject() {
    return unavailable();
  },

  async leaveProject() {
    return unavailable();
  },

  async createTask() {
    return unavailable();
  },

  async updateTask() {
    return unavailable();
  },

  async assignTask() {
    return unavailable();
  },
};

export default projectService;
