import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["learned", "built", "achievement"],
      required: true,
    },

    skill: {
      type: String,
      trim: true,
      default: "",
    },

    project: {
      type: String,
      trim: true,
      default: "",
    },

    likes: [
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

export default mongoose.model("Post", postSchema);
