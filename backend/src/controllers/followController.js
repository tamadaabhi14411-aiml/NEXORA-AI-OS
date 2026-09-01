import User from "../models/User.js";
import Follow from "../models/Follow.js";

// ============================================
// FOLLOW USER
// ============================================

export const followUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const { userId } = req.params;

    // Cannot follow yourself
    if (followerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    // Check target user
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check existing follow
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (existingFollow) {
      return res.status(409).json({
        success: false,
        message: "You are already following this user.",
      });
    }

    // Create follow relationship
    await Follow.create({
      follower: followerId,
      following: userId,
    });

    // Get updated counts
    const [followerCount, followingCount] =
      await Promise.all([
        Follow.countDocuments({
          following: userId,
        }),
        Follow.countDocuments({
          follower: followerId,
        }),
      ]);

    return res.status(201).json({
      success: true,
      message: "User followed successfully.",
      data: {
        userId,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Follow User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to follow user.",
    });
  }
};

// ============================================
// UNFOLLOW USER
// ============================================

export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const { userId } = req.params;

    // Cannot unfollow yourself
    if (followerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself.",
      });
    }

    const deletedFollow = await Follow.findOneAndDelete({
      follower: followerId,
      following: userId,
    });

    if (!deletedFollow) {
      return res.status(404).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    // Get updated counts
    const [followerCount, followingCount] =
      await Promise.all([
        Follow.countDocuments({
          following: userId,
        }),
        Follow.countDocuments({
          follower: followerId,
        }),
      ]);

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully.",
      data: {
        userId,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Unfollow User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unfollow user.",
    });
  }
};

// ============================================
// GET FOLLOW COUNTS
// ============================================

export const getFollowCounts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check target user
    const user = await User.findById(userId)
      .select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const [followerCount, followingCount] =
      await Promise.all([
        Follow.countDocuments({
          following: userId,
        }),
        Follow.countDocuments({
          follower: userId,
        }),
      ]);

    return res.status(200).json({
      success: true,
      message: "Follow counts retrieved successfully.",
      data: {
        userId,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Get Follow Counts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve follow counts.",
    });
  }
};