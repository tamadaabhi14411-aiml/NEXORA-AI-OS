import Community from "../models/Community.js";

// ============================================
// LIST COMMUNITIES
// ============================================

export const listCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("leader", "fullName email avatar")
      .populate("members", "fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Communities retrieved successfully.",
      data: communities,
    });
  } catch (error) {
    console.error("List Communities Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve communities.",
    });
  }
};

// ============================================
// GET COMMUNITY
// ============================================

export const getCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId)
      .populate("leader", "fullName email avatar")
      .populate("members", "fullName avatar");

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Community retrieved successfully.",
      data: community,
    });
  } catch (error) {
    console.error("Get Community Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve community.",
    });
  }
};

// ============================================
// JOIN COMMUNITY
// ============================================

export const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user._id;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    // Prevent duplicate membership
    const alreadyMember = community.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this community.",
      });
    }

    community.members.push(userId);

    await community.save();

    return res.status(200).json({
      success: true,
      message: "Joined community successfully.",
      data: {
        communityId: community._id,
        memberCount: community.members.length,
      },
    });
  } catch (error) {
    console.error("Join Community Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join community.",
    });
  }
};

// ============================================
// LEAVE COMMUNITY
// ============================================

export const leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user._id;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    // Leader cannot leave their own community
    if (community.leader.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Community leader cannot leave their own community.",
      });
    }

    const memberIndex = community.members.findIndex(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "You are not a member of this community.",
      });
    }

    community.members.splice(memberIndex, 1);

    await community.save();

    return res.status(200).json({
      success: true,
      message: "Left community successfully.",
      data: {
        communityId: community._id,
        memberCount: community.members.length,
      },
    });
  } catch (error) {
    console.error("Leave Community Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave community.",
    });
  }
};