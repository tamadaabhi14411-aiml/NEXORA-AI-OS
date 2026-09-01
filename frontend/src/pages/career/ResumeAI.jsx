import { useEffect, useState } from "react";
import {
  User,
  Code2,
  FolderKanban,
  GraduationCap,
  Trophy,
  Briefcase,
  Users,
  Target,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import profileService from "../../services/profileService";

function ResumeAI() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await profileService.getProfile();

      if (!data?.success || !data?.data) {
        throw new Error("Invalid profile response.");
      }

      setProfileData(data.data);
    } catch (error) {
      console.error("Resume AI profile error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status === 404) {
        setError("Profile not found.");
      } else if (error.response?.status >= 500) {
        setError("The profile service is currently unavailable.");
      } else if (error.request) {
        setError("Unable to connect to the backend.");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
            <p className="mt-4 text-sm text-zinc-400">
              Loading your profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 text-red-400" size={22} />

              <div>
                <h2 className="font-semibold text-white">
                  Unable to load Resume AI
                </h2>

                <p className="mt-1 text-sm text-red-300">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadProfile}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const profile = profileData?.profile || {};
  const skills = Array.isArray(profileData?.skills)
    ? profileData.skills
    : [];
  const projects = Array.isArray(profileData?.projects)
    ? profileData.projects
    : [];
  const achievements = Array.isArray(profileData?.achievements)
    ? profileData.achievements
    : [];
  const education = Array.isArray(profileData?.education)
    ? profileData.education
    : [];
  const experience = Array.isArray(profileData?.experience)
    ? profileData.experience
    : [];
  const community = Array.isArray(profileData?.community)
    ? profileData.community
    : [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600/10 p-3">
              <Target className="text-blue-500" size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Resume AI
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Analyze your profile and prepare for your target role.
              </p>
            </div>
          </div>
        </div>

        {/* Target selection */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">
            Target
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Select your target company and role.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <select
              defaultValue=""
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select target company
              </option>
              <option value="google">Google</option>
              <option value="microsoft">Microsoft</option>
              <option value="amazon">Amazon</option>
              <option value="apple">Apple</option>
              <option value="meta">Meta</option>
            </select>

            <select
              defaultValue=""
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select target role
              </option>
              <option value="software-engineer">
                Software Engineer
              </option>
              <option value="data-scientist">
                Data Scientist
              </option>
              <option value="data-analyst">
                Data Analyst
              </option>
              <option value="ml-engineer">
                ML Engineer
              </option>
            </select>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={20} />

            <div>
              <h2 className="font-semibold text-white">
                Your Profile
              </h2>

              <p className="text-sm text-zinc-500">
                Information available from your NEXORA profile.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileItem
              label="Name"
              value={profile.name}
            />

            <ProfileItem
              label="Email"
              value={profile.email}
            />

            <ProfileItem
              label="College"
              value={profile.college}
            />

            <ProfileItem
              label="Branch"
              value={profile.branch}
            />

            <ProfileItem
              label="Year"
              value={profile.year}
            />
          </div>
        </div>

        {/* Skills */}
        <DataSection
          icon={Code2}
          title="Skills"
          items={skills}
          emptyText="No skills available in your profile yet."
          renderItem={(item, index) => (
            <span
              key={item?._id || item?.id || index}
              className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-300"
            >
              {typeof item === "string"
                ? item
                : item?.name || item?.skill || item?.title || "Skill"}
            </span>
          )}
        />

        {/* Projects */}
        <DataSection
          icon={FolderKanban}
          title="Projects"
          items={projects}
          emptyText="No projects available in your profile yet."
          renderItem={(item, index) => (
            <div
              key={item?._id || item?.id || index}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <h3 className="font-medium text-white">
                {typeof item === "string"
                  ? item
                  : item?.name ||
                    item?.title ||
                    "Project"}
              </h3>

              {(item?.description || item?.details) && (
                <p className="mt-2 text-sm text-zinc-500">
                  {item.description || item.details}
                </p>
              )}
            </div>
          )}
        />

        {/* Additional profile evidence */}
        <div className="grid gap-6 md:grid-cols-2">
          <DataSection
            icon={GraduationCap}
            title="Education"
            items={education}
            emptyText="No education details available."
            renderItem={(item, index) => (
              <SimpleItem
                key={item?._id || item?.id || index}
                item={item}
              />
            )}
          />

          <DataSection
            icon={Trophy}
            title="Achievements"
            items={achievements}
            emptyText="No achievements available."
            renderItem={(item, index) => (
              <SimpleItem
                key={item?._id || item?.id || index}
                item={item}
              />
            )}
          />

          <DataSection
            icon={Briefcase}
            title="Experience"
            items={experience}
            emptyText="No experience available."
            renderItem={(item, index) => (
              <SimpleItem
                key={item?._id || item?.id || index}
                item={item}
              />
            )}
          />

          <DataSection
            icon={Users}
            title="Community & Leadership"
            items={community}
            emptyText="No community or leadership evidence available."
            renderItem={(item, index) => (
              <SimpleItem
                key={item?._id || item?.id || index}
                item={item}
              />
            )}
          />
        </div>

        {/* Match / Gap placeholder */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="font-semibold text-white">
            Match & Skill Gaps
          </h2>

          <div className="mt-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-5">
            <p className="text-sm font-medium text-zinc-300">
              Development placeholder
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Match scores and skill-gap analysis will be shown here
              once a backend analysis endpoint is available.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs text-zinc-500">{label}</p>

      <p className="mt-2 truncate text-sm font-medium text-white">
        {value || "Not available"}
      </p>
    </div>
  );
}

function DataSection({
  icon: Icon,
  title,
  items,
  emptyText,
  renderItem,
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-3">
        <Icon className="text-blue-500" size={20} />

        <h2 className="font-semibold text-white">
          {title}
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-zinc-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          {items.map(renderItem)}
        </div>
      )}
    </div>
  );
}

function SimpleItem({ item }) {
  const text =
    typeof item === "string"
      ? item
      : item?.name ||
        item?.title ||
        item?.description ||
        item?.details ||
        "Information available";

  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-sm text-zinc-300">
        {text}
      </p>
    </div>
  );
}

export default ResumeAI;
