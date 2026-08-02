import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profile: {
      name: String,
      email: String,
      college: String,
      branch: String,
      year: String,
    },

    career: {
      goal: String,
      targetYear: String,
      currentLevel: String,
    },

    skills: [
      {
        type: String,
      },
    ],

    projects: [
      {
        type: String,
      },
    ],

    preferences: {
      theme: String,
      language: String,
      explanationStyle: String,
    },

    notes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Memory", memorySchema);