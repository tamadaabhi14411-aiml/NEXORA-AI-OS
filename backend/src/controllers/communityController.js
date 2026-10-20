import mongoose from "mongoose";

import Community from "../models/Community.js";
import CommunityMembership from "../models/CommunityMembership.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";

// ============================================
// CREATE COMMUNITY
// ============================================

export const createCommunity = async (req, res) => {
  try {
    const { name, skill, description, rules = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Community name is required.",
      });
    }

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Community description is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(skill)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID.",
      });
    }

    const skillExists = await Skill.findById(skill);

    if (!skillExists) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const slugBase = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = slugBase;
    let counter = 1;

    while (await Community.findOne({ slug })) {
      slug = `${slugBase}-${counter}`;
      counter++;
    }

    const community = await Community.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      skill,
      leader: req.user._id,
      rules: Array.isArray(rules) ? rules : [],
      members: [req.user._id],
    });

    await CommunityMembership.create({
      community: community._id,
      user: req.user._id,
      role: "Leader",
    });

    const populatedCommunity = await Community.findById(community._id)
      .populate("skill", "name level description")
      .populate("leader", "fullName avatar role");

    return res.status(201).json({
      success: true,
      message: "Community created successfully.",
      data: populatedCommunity,
    });
  } catch (error) {
    console.error("Create Community Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create community.",
    });
  }
};

// ============================================
// GET COMMUNITIES
// ============================================
export const listCommunities = async (req, res) => {
  try {
    const communities = await Community.find({})
      .populate("skill", "name level description")
      .populate("leader", "fullName role avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Communities retrieved successfully.",
      data: communities,
    });
  } catch (error) {
    console.error("GET COMMUNITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve communities.",
      error: error.message,
    });
  }
};
// Compatibility alias
export const getCommunities = listCommunities;

// ============================================
// GET SINGLE COMMUNITY
// ============================================

export const getCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community ID.",
      });
    }

    const community = await Community.findById(communityId)
      .populate("skill", "name level description")
      .populate("leader", "fullName avatar role")
      .lean();

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    const [postCount, projectCount] = await Promise.all([
      Post.countDocuments({ community: community._id }),
      Project.countDocuments({ community: community._id }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        _id: community._id,
        name: community.name,
        slug: community.slug,
        description: community.description,
        rules: community.rules,
        skill: community.skill,
        leader: community.leader,
        memberCount: community.members.length,
        postCount,
        projectCount,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
      },
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
// UPDATE COMMUNITY
// ============================================

export const updateCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { name, description, rules } = req.body;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    if (community.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the community leader can update the community.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Community name cannot be empty.",
        });
      }

      community.name = name.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Community description cannot be empty.",
        });
      }

      community.description = description.trim();
    }

    if (rules !== undefined) {
      if (!Array.isArray(rules)) {
        return res.status(400).json({
          success: false,
          message: "Rules must be an array.",
        });
      }

      community.rules = rules;
    }

    await community.save();

    return res.status(200).json({
      success: true,
      message: "Community updated successfully.",
      data: community,
    });
  } catch (error) {
    console.error("Update Community Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update community.",
    });
  }
};

// ============================================
// DELETE COMMUNITY
// ============================================

export const deleteCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    if (community.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the community leader can delete the community.",
      });
    }

    await Community.deleteOne({ _id: communityId });

    await CommunityMembership.deleteMany({
      community: communityId,
    });

    // Do not delete users, skills, posts or projects.

    return res.status(200).json({
      success: true,
      message: "Community deleted successfully.",
      data: {
        communityId,
      },
    });
  } catch (error) {
    console.error("Delete Community Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete community.",
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

    await CommunityMembership.create({
      community: community._id,
      user: userId,
      role: "Member",
    });

    return res.status(200).json({
      success: true,
      joined: true,
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

    if (community.leader.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Community leader cannot leave the community.",
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

    await CommunityMembership.deleteOne({
      community: community._id,
      user: userId,
    });

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

// ============================================
// GET MEMBERS
// ============================================

export const getCommunityMembers = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    const memberships = await CommunityMembership.find({
      community: communityId,
    })
      .populate("user", "fullName avatar role")
      .sort({ createdAt: 1 })
      .lean();

    const data = memberships.map((membership) => ({
      user: membership.user,
      role: membership.role,
      joinedAt: membership.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Community Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve community members.",
    });
  }
};

// ============================================
// GET COMMUNITY POSTS
// ============================================

export const getCommunityPosts = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    const posts = await Post.find({
      community: communityId,
    })
      .populate("user", "fullName avatar role")
      .populate("skill", "name level")
      .populate("project", "title description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get Community Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve community posts.",
    });
  }
};

// ============================================
// CREATE COMMUNITY POST
// ============================================

export const createCommunityPost = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { title, description, skill } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post title is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post description is required.",
      });
    }

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required.",
      });
    }

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    const isMember = community.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Only community members can create posts.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(skill)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID.",
      });
    }

    const skillExists = await Skill.findById(skill);

    if (!skillExists) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const post = await Post.create({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      skill,
      community: community._id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "fullName avatar role")
      .populate("skill", "name level")
      .populate("community", "name slug");

    return res.status(201).json({
      success: true,
      message: "Community post created successfully.",
      data: populatedPost,
    });
  } catch (error) {
    console.error("Create Community Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create community post.",
    });
  }
};

// ============================================
// GET COMMUNITY PROJECTS
// ============================================

export const getCommunityProjects = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found.",
      });
    }

    const projects = await Project.find({
      community: communityId,
    })
      .populate("owner", "fullName avatar role")
      .populate("members", "fullName avatar role")
      .sort({ createdAt: -1 })
      .lean();

    const data = projects.map((project) => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      skill: project.skill,
      owner: project.owner,
      memberCount: project.members.length,
      status: project.status,
      createdAt: project.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Community Projects Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve community projects.",
    });
  }
};