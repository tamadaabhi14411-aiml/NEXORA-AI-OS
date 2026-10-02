import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    experience: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    achievements: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    leadership: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    matchScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);