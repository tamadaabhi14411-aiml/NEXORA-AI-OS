import User from "../models/User.js";
import Follow from "../models/Follow.js";

// ============================================
// FOLLOW USER
// ============================================

export const followUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const { userId } = req.params;

    if (followerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

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

    await Follow.create({
      follower: followerId,
      following: userId,
    });

    const [followerCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: followerId }),
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

    const [followerCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: followerId }),
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

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const [followerCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: userId }),
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

// ============================================
// GET FOLLOWERS
// ============================================

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const followers = await Follow.find({
      following: userId,
    })
      .populate("follower", "fullName email avatar role xp level")
      .sort({ createdAt: -1 })
      .lean();

    const data = followers.map((item) => item.follower);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Followers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve followers.",
    });
  }
};

// ============================================
// GET FOLLOWING
// ============================================

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const following = await Follow.find({
      follower: userId,
    })
      .populate("following", "fullName email avatar role xp level")
      .sort({ createdAt: -1 })
      .lean();

    const data = following.map((item) => item.following);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Following Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve following.",
    });
  }
};