import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Signup() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join NEXORA AI OS today"
    >
      <div className="space-y-4">
        <Input placeholder="Full Name" />

        <Input
          type="email"
          placeholder="Email Address"
        />

        <Input
          type="password"
          placeholder="Password"
        />

        <Button>
          Create Account
        </Button>
      </div>
    </AuthLayout>
  );
}

export default Signup;