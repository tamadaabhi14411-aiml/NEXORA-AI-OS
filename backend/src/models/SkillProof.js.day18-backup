import mongoose from "mongoose";

const skillProofSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },

    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },

    projectDescription: {
      type: String,
      required: true,
      trim: true,
    },

    contribution: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

skillProofSchema.index(
  { user: 1, project: 1, skill: 1 },
  { unique: true }
);

export default mongoose.model("SkillProof", skillProofSchema);