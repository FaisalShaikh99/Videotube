import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/authSlice.js";
import Input from "../components/shared/Input/Input";
import Button from "../components/shared/Button/Button";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/auth/authLayout.jsx";
import AuthCard from "../layout/auth/authCard.jsx";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => navigate(`/verify-otp/${email}`, { state: { email } }))
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your registered email to receive OTP"
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button loading={isSubmitting} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default ForgotPassword;
