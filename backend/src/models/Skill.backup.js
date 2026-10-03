@'
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Kept for existing NEXORA skill-follow functionality
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Same user should not create duplicate skills
skillSchema.index(
  { user: 1, name: 1 },
  { unique: true }
);

export default mongoose.model("Skill", skillSchema);
'@ | Set-Content src\models\Skill.js