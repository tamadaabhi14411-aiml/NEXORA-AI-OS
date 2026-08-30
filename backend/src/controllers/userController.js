import User from "../models/User.js";
import Memory from "../models/Memory.js";

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