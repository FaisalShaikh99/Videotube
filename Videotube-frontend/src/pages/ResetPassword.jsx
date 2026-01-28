import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/auth/authSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Input from "../components/shared/Input/Input";
import Button from "../components/shared/Button/Button";
import AuthLayout from "../layout/auth/authLayout.jsx";
import AuthCard from "../layout/auth/authCard.jsx";
import { toast } from "react-toastify";

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {email} = useParams()

  const { error } = useSelector((state) => state.auth);

  // 🚨 Safety check: direct page open na ho
  useEffect(() => {
    if (!email) {
      toast.error("Invalid reset request. Please try again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    dispatch(
      resetPassword({
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Password updated successfully");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err || "Password change failed");
      })
      .finally(() => {
        setIsSubmitting(false);
      });

  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="Create a strong new password"
        footer={
          <>
            Remember password?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </>
        }
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            icon={showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            iconPosition="right"
            onIconClick={() => setShowNewPassword(!showNewPassword)}
            required
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            icon={showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            iconPosition="right"
            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />

          {/* IMPORTANT: button type submit */}
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPassword;
