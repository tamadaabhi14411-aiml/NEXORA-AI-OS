import { Sparkles } from "lucide-react";
import Card from "../ui/Card";

function WelcomeCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 border-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-100">
            Welcome Back
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            NEXORA AI OS
          </h1>

          <p className="mt-4 max-w-2xl text-blue-100">
            Your intelligent workspace for AI, learning, productivity,
            career growth, and collaboration—all in one platform.
          </p>

          <button className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-zinc-100">
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