import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can follow another user only once
followSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);

// A user cannot follow themselves
followSchema.pre("validate", function () {
  if (
    this.follower &&
    this.following &&
    this.follower.equals(this.following)
  ) {
    throw new Error("A user cannot follow themselves.");
  }
});

export default mongoose.model("Follow", followSchema);