import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await authService.login({
        email: email.trim(),
        password,
      });

      const token =
        data.token ||
        data.accessToken ||
        data.jwt;

      if (!token) {
        throw new Error(
          "Login response did not contain a JWT token."
        );
      }

      await login(token);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            `Login failed (${error.response.status}).`
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the backend."
        );
      } else {
        setError(
          error.message || "Login failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to NEXORA AI OS"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          disabled={loading}
        />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;