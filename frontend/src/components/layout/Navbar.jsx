import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-black px-6 py-4 text-white">
      <h2 className="text-lg font-semibold">
        NEXORA AI OS
      </h2>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              {user.fullName || user.name || "User"}
            </p>
            <p className="text-xs text-zinc-400">
              {user.email || ""}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:bg-zinc-800"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
