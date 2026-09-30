import api from "./api";

const SKILL_PROOF_API_UNAVAILABLE =
  "Skill Proof APIs are not available on the current backend.";

const getErrorMessage = (error) => {
  if (error?.response?.status === 404) {
    return SKILL_PROOF_API_UNAVAILABLE;
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load skill proofs."
  );
};

const skillProofService = {
  async getMySkillProofs() {
    try {
      const response = await api.get("/skill-proofs/me");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getUserSkillProofs(userId) {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    try {
      const response = await api.get(`/skill-proofs/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getSkillProof(proofId) {
    if (!proofId) {
      throw new Error("Skill proof ID is required.");
    }

    try {
      const response = await api.get(`/skill-proofs/${proofId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default skillProofService;

