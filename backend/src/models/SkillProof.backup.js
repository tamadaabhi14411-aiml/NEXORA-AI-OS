@'
import mongoose from "mongoose";

const skillProofSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "Project",
        "Post",
        "Achievement",
        "Certificate",
        "Community Contribution",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },

    evidenceUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // Kept for compatibility with older proof records
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },

    contribution: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

skillProofSchema.index({
  user: 1,
  skill: 1,
  createdAt: -1,
});

export default mongoose.model("SkillProof", skillProofSchema);
'@ | Set-Content src\models\SkillProof.js