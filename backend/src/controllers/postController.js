import Post from "../models/Post.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { content, type, skill, project } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required.",
      });
    }

    if (!["learned", "built", "achievement"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post type.",
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      type,
      skill: skill?.trim() || "",
      project: project?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
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
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName avatar role")
      .sort({ createdAt: -1 });

    const feed = posts.map((post) => ({
      _id: post._id,
      author: post.author,
      content: post.content,
      type: post.type,
      skill: post.skill,
      project: post.project,
      likeCount: post.likes.length,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Feed retrieved successfully",
      data: feed,
    });
  } catch (error) {
    console.error("Get Feed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve feed.",
    });
  }
};

// LIKE POST
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      return res.status(409).json({
        success: false,
        message: "You already liked this post.",
      });
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      data: {
        postId: post._id,
        likeCount: post.likes.length,
      },
    });
  } catch (error) {
    console.error("Like Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to like post.",
    });
  }
};

// UNLIKE POST
export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.likes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      data: {
        postId: post._id,
        likeCount: post.likes.length,
      },
    });
  } catch (error) {
    console.error("Unlike Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unlike post.",
    });
  }
};
// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("author", "fullName avatar role")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully.",
      data: {
        _id: post._id,
        author: post.author,
        content: post.content,
        type: post.type,
        skill: post.skill,
        project: post.project,
        likeCount: post.likes.length,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve post.",
    });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, type, skill, project } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own post.",
      });
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Content cannot be empty.",
        });
      }

      post.content = content.trim();
    }

    if (type !== undefined) {
      if (!["learned", "built", "achievement"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid post type.",
        });
      }

      post.type = type;
    }

    if (skill !== undefined) {
      post.skill = skill.trim();
    }

    if (project !== undefined) {
      post.project = project.trim();
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Update Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update post.",
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own post.",
      });
    }

    await Post.findByIdAndDelete(postId);

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

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.comments.push({
      user: req.user._id,
      content: content.trim(),
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: newComment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment.",
    });
  }
};

// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("comments.user", "fullName avatar role")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comments retrieved successfully.",
      data: post.comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comments.",
    });
  }
};