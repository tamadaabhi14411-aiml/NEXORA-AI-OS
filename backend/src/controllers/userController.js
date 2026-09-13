import User from "../models/User.js";
import Memory from "../models/Memory.js";
import Follow from "../models/Follow.js";
import Community from "../models/Community.js";

// ===============================
// Get Logged-in User Profile
// ===============================

export const getProfile = async (req, res) => {
  try {
    // Get only the authenticated user's data
    // Password is explicitly excluded
    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get existing career-related memory
    // Only retrieve memory belonging to the authenticated user
    const memory = await Memory.findOne({
      user: req.user._id,
    }).lean();

    res.status(200).json({
      success: true,
      message: "Profile data retrieved successfully.",
      data: {
        profile: {
          name: memory?.profile?.name || user.fullName,
          email: memory?.profile?.email || user.email,
          college: memory?.profile?.college || "",
          branch: memory?.profile?.branch || "",
          year: memory?.profile?.year || "",
        },

        career: memory?.career || {},

        skills: memory?.skills || [],

        projects: memory?.projects || [],

        achievements: [],

        education: [],

        experience: [],

        community: [],
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===============================
// Get Public Skill Identity
// ===============================

export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only public User fields are selected
    // Email and password are NOT exposed
    const user = await User.findById(userId)
      .select("fullName avatar role xp level")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get existing skill/project data
    const memory = await Memory.findOne({
      user: userId,
    }).lean();

    // Get follow counts and community evidence
    const [followerCount, followingCount, communities] =
      await Promise.all([
        Follow.countDocuments({
          following: userId,
        }),

        Follow.countDocuments({
          follower: userId,
        }),

        Community.find({
          $or: [
            { leader: userId },
            { members: userId },
          ],
        })
          .select("name skill description leader createdAt")
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      message: "Public skill identity retrieved successfully.",
      data: {
        profile: {
          name: memory?.profile?.name || user.fullName,
          avatar: user.avatar,
          role: user.role,
        },

        skills: memory?.skills || [],

        projects: memory?.projects || [],

        // No Achievement model currently exists
        achievements: [],

        // No learning milestone model currently exists
        learningMilestones: [],

        // Existing community participation/leadership
        community: communities,

        // Existing reputation data
        reputation: {
          xp: user.xp,
          level: user.level,
        },

        // Existing follow system
        follow: {
          followerCount,
          followingCount,
        },
      },
    });
  } catch (error) {
    console.error("Get Public Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve public skill identity.",
    });
  }
};

// ===============================
// Update Logged-in User Profile
// ===============================

export const updateProfile = async (req, res) => {
  try {
    const { fullName, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};