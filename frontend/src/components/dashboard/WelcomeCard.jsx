import { Sparkles } from "lucide-react";
import Card from "../ui/Card";
import { useAuth } from "../../context/AuthContext";

function WelcomeCard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 border-none">
        <div className="text-white">
          <p className="text-sm uppercase tracking-widest text-blue-100">
            Welcome Back
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Loading...
          </h1>

          <p className="mt-4 text-blue-100">
            Loading your profile information...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 border-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-100">
            Welcome Back
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            {user?.fullName || user?.name || "User"}
          </h1>

          <div className="mt-4 space-y-1 text-blue-100">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {user?.email || "Not available"}
            </p>

            <p>
              <span className="font-semibold">Role:</span>{" "}
              {user?.role || "Not available"}
            </p>
          </div>

          <p className="mt-4 max-w-2xl text-blue-100">
            Your intelligent workspace for AI, learning,
            productivity, career growth, and collaboration—all
            in one platform.
          </p>

          <button
            type="button"
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-zinc-100"
          >
            Explore AI Assistant
          </button>
        </div>

        <div className="hidden rounded-3xl bg-white/10 p-6 backdrop-blur-lg md:block">
          <Sparkles size={80} className="text-white" />
        </div>
      </div>
    </Card>
  );
}

export default WelcomeCard;