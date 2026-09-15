import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Check,
  Plus,
  BookOpen,
  Code2,
  Trophy,
  Sparkles,
  Clock3,
  User,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const POST_TYPES = [
  {
    value: "Learned",
    label: "Learned",
    icon: BookOpen,
  },
  {
    value: "Built",
    label: "Built",
    icon: Code2,
  },
  {
    value: "Achievement",
    label: "Achievement",
    icon: Trophy,
  },
];

const createInitialPosts = (user) => [
  {
    id: "demo-1",
    authorId: "nexora-demo-1",
    authorName: "NEXORA Community",
    avatar: "",
    skill: "React",
    type: "Learned",
    content:
      "Exploring reusable components and learning how to keep React interfaces clean and scalable.",
    project: "",
    createdAt: "Today",
    likes: 12,
    comments: 3,
    liked: false,
    following: false,
  },
  {
    id: "demo-2",
    authorId: "nexora-demo-2",
    authorName: "NEXORA Builder",
    avatar: "",
    skill: "Python",
    type: "Built",
    content:
      "Built a small expense tracker using Python and practiced working with structured data.",
    project: "Python Expense Tracker",
    createdAt: "Yesterday",
    likes: 8,
    comments: 2,
    liked: false,
    following: false,
  },
  ...(user
    ? [
        {
          id: "local-user-post",
          authorId: user._id || user.id || "current-user",
          authorName: user.fullName || "You",
          avatar: user.avatar || "",
          skill: "Your Skill",
          type: "Learned",
          content:
            "Start sharing what you learn, build and achieve with the NEXORA community.",
          project: "",
          createdAt: "Just now",
          likes: 0,
          comments: 0,
          liked: false,
          following: false,
          isLocalPlaceholder: true,
        },
      ]
    : []),
];

function formatAvatar(name, avatar) {
  if (avatar) {
    return avatar;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "NEXORA User"
  )}&background=111827&color=ffffff`;
}

function PostTypeBadge({ type }) {
  const config =
    POST_TYPES.find((postType) => postType.value === type) ||
    POST_TYPES[0];

  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-bold">
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function EmptyFeed() {
  return (
    <div className="glass-card rounded-3xl border border-slate-800 p-10 text-center">
      <Sparkles className="w-10 h-10 mx-auto text-purple-400 mb-4" />

      <h2 className="text-lg font-bold text-white">
        Your skill feed is empty
      </h2>

      <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
        Be the first to share something you learned, built or achieved.
      </p>
    </div>
  );
}

export default function SkillFeedPage() {
  const { user, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState(() => createInitialPosts(user));
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [postType, setPostType] = useState("Learned");
  const [skill, setSkill] = useState("");
  const [content, setContent] = useState("");
  const [project, setProject] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return posts;
    }

    return posts.filter((post) => {
      return (
        post.authorName.toLowerCase().includes(query) ||
        post.skill.toLowerCase().includes(query) ||
        post.type.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.project.toLowerCase().includes(query)
      );
    });
  }, [posts, search]);

  const handleCreatePost = async (event) => {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("Please log in to create a skill post.");
      return;
    }

    if (!skill.trim()) {
      setError("Please enter a skill.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter your post content.");
      return;
    }

    setCreating(true);

    try {
      /*
       * Day 11 backend limitation:
       * No post creation API currently exists.
       *
       * Therefore this is intentionally session-only frontend content.
       * It is not presented as backend-persisted data.
       */

      const newPost = {
        id: `local-${Date.now()}`,
        authorId: user._id || user.id || "current-user",
        authorName: user.fullName || "You",
        avatar: user.avatar || "",
        skill: skill.trim(),
        type: postType,
        content: content.trim(),
        project: project.trim(),
        createdAt: "Just now",
        likes: 0,
        comments: 0,
        liked: false,
        following: false,
        isLocal: true,
      };

      setPosts((currentPosts) => [newPost, ...currentPosts]);

      setSkill("");
      setContent("");
      setProject("");
      setPostType("Learned");
      setIsCreateOpen(false);
    } catch {
      setError("Unable to create the post.");
    } finally {
      setCreating(false);
    }
  };

  const handleLike = (postId) => {
    setError(
      "Like is not available yet because the current backend does not provide a like API."
    );

    /*
     * We intentionally do not permanently change the like count.
     * Day 11 requires real backend like functionality.
     */
    console.info("Like requested for post:", postId);
  };

  const handleFollow = (postId) => {
    setError(
      "Follow is not available yet because the current backend does not provide a follow API."
    );

    /*
     * We intentionally do not create a second/local follow system.
     */
    console.info("Follow requested for user:", postId);
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-sm text-slate-400">
          Loading skill feed...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="glass-card rounded-3xl border border-slate-800 p-8 text-center">
          <User className="w-10 h-10 mx-auto text-slate-500 mb-4" />

          <h1 className="text-xl font-bold text-white">
            Skill Feed unavailable
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Please log in to view and share skill activity.
          </p>

          <Link
            to="/login"
            className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Skill Feed
            </h1>
          </div>

          <p className="text-sm text-slate-400 mt-2">
            Learn. Practice. Build. Share your progress with NEXORA.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setIsCreateOpen((current) => !current);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition"
        >
          <Plus className="w-4 h-4" />
          {isCreateOpen ? "Close" : "Create Post"}
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-3">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search skills, people or posts..."
          className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

          <p className="text-xs text-amber-200">
            {error}
          </p>
        </div>
      )}

      {/* Create Post */}
      {isCreateOpen && (
        <form
          onSubmit={handleCreatePost}
          className="glass-card rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-5"
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              Share your progress
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Tell the community what you learned, built or achieved.
            </p>
          </div>

          {/* Post Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Post Type
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {POST_TYPES.map((type) => {
                const Icon = type.icon;
                const selected = postType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setPostType(type.value)}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-xs font-bold transition ${
                      selected
                        ? "bg-purple-500/15 border-purple-500/50 text-purple-300"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Skill
            </label>

            <input
              type="text"
              value={skill}
              onChange={(event) => setSkill(event.target.value)}
              placeholder="Example: Python, React, Java"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              What happened?
            </label>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              placeholder={
                postType === "Learned"
                  ? "I learned list comprehensions today."
                  : postType === "Built"
                    ? "Built an expense tracker using Python."
                    : "Completed a new milestone in my learning journey."
              }
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Project (optional)
            </label>

            <input
              type="text"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              placeholder="Example: NEXORA AI OS"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold"
            >
              {creating ? "Creating..." : "Share Post"}
            </button>
          </div>

          <p className="text-[10px] text-slate-600">
            Post persistence will use the backend once a post API is available.
          </p>
        </form>
      )}

      {/* Feed */}
      {filteredPosts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="glass-card rounded-3xl border border-slate-800 p-5 sm:p-6"
            >
              {/* Author */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={formatAvatar(post.authorName, post.avatar)}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-700"
                  />

                  <div className="min-w-0">
                    <Link
                      to={
                        post.authorId ===
                        (user._id || user.id || "current-user")
                          ? "/profile"
                          : `/profile/${post.authorId}`
                      }
                      className="text-sm font-bold text-white hover:text-purple-300 transition truncate block"
                    >
                      {post.authorName}
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-purple-400 font-semibold">
                        {post.skill}
                      </span>

                      <span className="text-slate-700">•</span>

                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {post.authorId !==
                  (user._id || user.id || "current-user") && (
                  <button
                    type="button"
                    onClick={() => handleFollow(post.authorId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50 text-[10px] font-bold shrink-0"
                  >
                    <UserPlus className="w-3 h-3" />
                    Follow
                  </button>
                )}
              </div>

              {/* Type */}
              <div className="mt-5">
                <PostTypeBadge type={post.type} />
              </div>

              {/* Content */}
              <div className="mt-4">
                <p className="text-sm text-slate-200 leading-7">
                  {post.content}
                </p>
              </div>

              {/* Project */}
              {post.project && (
                <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-purple-400">
                    Project
                  </p>

                  <p className="text-sm font-semibold text-white mt-1">
                    {post.project}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-pink-400 transition"
                >
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Comments are not available because the current backend does not provide a comment API."
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>

                {post.liked && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" />
                    Liked
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}