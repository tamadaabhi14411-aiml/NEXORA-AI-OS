import mongoose from "mongoose";
import Post from "../models/Post.js";
import PostComment from "../models/PostComment.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const postData = (post, commentCount = 0) => ({
  _id: post._id,
  author: post.user,
  skill: post.skill,
  project: post.project,
  title: post.title,
  description: post.description,
  evidenceUrl: post.evidenceUrl,
  imageUrl: post.imageUrl,
  likesCount: post.likes?.length || 0,
  commentsCount: commentCount,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      skill,
      project,
      evidenceUrl,
      imageUrl,
    } = req.body;

    if (!title?.trim() || !description?.trim() || !skill) {
      return res.status(400).json({
        success: false,
        message: "Title, description and skill are required.",
      });
    }

    if (!validId(skill)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID.",
      });
    }

    const skillDoc = await Skill.findOne({
      _id: skill,
      user: req.user._id,
    });

    if (!skillDoc) {
      return res.status(403).json({
        success: false,
        message: "You can only use your own skill.",
      });
    }

    let projectDoc = null;

    if (project) {
      if (!validId(project)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      projectDoc = await Project.findOne({
        _id: project,
        $or: [
          { owner: req.user._id },
          { members: req.user._id },
        ],
      });

      if (!projectDoc) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this project.",
        });
      }
    }

    const post = await Post.create({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      skill: skillDoc._id,
      project: projectDoc ? projectDoc._id : null,
      evidenceUrl: evidenceUrl?.trim() || "",
      imageUrl: imageUrl?.trim() || "",
    });

    const populated = await Post.findById(post._id)
      .populate("user", "fullName avatar role")
      .populate("skill", "name level")
      .populate("project", "title description");

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: postData(populated),
    });
  } catch (error) {
    console.error("Create Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post.",
    });
  }
};

// GET FEED
export const getPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      50
    );

    const mode = req.query.mode || "forYou";

    let filter = {};

    if (mode === "following") {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required for following feed.",
        });
      }

      const user = await User.findById(req.user._id).select("following");

      filter.user = { $in: user?.following || [] };
    }

    let posts = await Post.find(filter)
      .populate("user", "fullName avatar role")
      .populate("skill", "name level")
      .populate("project", "title description")
      .sort(
        mode === "trending"
          ? { likes: -1, createdAt: -1 }
          : { createdAt: -1 }
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const postIds = posts.map((post) => post._id);

    const commentCounts = await PostComment.aggregate([
      {
        $match: {
          post: { $in: postIds },
        },
      },
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      commentCounts.map((item) => [
        item._id.toString(),
        item.count,
      ])
    );

    const data = posts.map((post) =>
      postData(
        post,
        countMap.get(post._id.toString()) || 0
      )
    );

    const total = await Post.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        posts: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("===== GET POSTS ERROR =====");
console.error("NAME:", error.name);
console.error("MESSAGE:", error.message);
console.error("STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve posts.",
    });
  }
};

// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const post = await Post.findById(id)
      .populate("user", "fullName avatar role")
      .populate("skill", "name level")
      .populate("project", "title description")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const commentsCount = await PostComment.countDocuments({
      post: id,
    });

    return res.status(200).json({
      success: true,
      data: postData(post, commentsCount),
    });
  } catch (error) {
    console.error("Get Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve post.",
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }

    await PostComment.deleteMany({ post: id });
    await Post.findByIdAndDelete(id);

    await User.updateMany(
      { savedPosts: id },
      { $pull: { savedPosts: id } }
    );

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post.",
    });
  }
};

// LIKE
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (!alreadyLiked) {
      post.likes.push(req.user._id);
      await post.save();
    }

    return res.status(200).json({
      success: true,
      liked: true,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to like post.",
    });
  }
};

// UNLIKE
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await post.save();

    return res.status(200).json({
      success: true,
      liked: false,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Unlike Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unlike post.",
    });
  }
};

// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).select("_id");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const comments = await PostComment.find({ post: id })
      .populate("user", "fullName avatar role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comments.",
    });
  }
};

// CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required.",
      });
    }

    const post = await Post.findById(id).select("_id");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const comment = await PostComment.create({
      user: req.user._id,
      post: id,
      text: text.trim(),
    });

    const populated = await PostComment.findById(comment._id)
      .populate("user", "fullName avatar role");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: populated,
    });
  } catch (error) {
    console.error("Create Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment.",
    });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await PostComment.findOne({
      _id: commentId,
      post: postId,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    await PostComment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
};

// SAVE POST
export const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select("_id");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedPosts: post._id },
    });

    return res.status(200).json({
      success: true,
      saved: true,
      message: "Post saved successfully.",
    });
  } catch (error) {
    console.error("Save Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save post.",
    });
  }
};

// UNSAVE POST
export const unsavePost = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedPosts: req.params.id },
    });

    return res.status(200).json({
      success: true,
      saved: false,
      message: "Post unsaved successfully.",
    });
  } catch (error) {
    console.error("Unsave Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unsave post.",
    });
  }
};