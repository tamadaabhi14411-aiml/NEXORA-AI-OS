import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to NEXORA AI OS"
    >
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email Address"
        />

        <Input
          type="password"
          placeholder="Password"
        />

        <Button>
          Login
        </Button>
      </div>
    </AuthLayout>
  );
}

export default Login;