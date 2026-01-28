import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { verifyEmail, getCurrentUser } from "../features/auth/authSlice";

const VerifyingEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyEmailAsync = async () => {
      try {
        await dispatch(verifyEmail(token)).unwrap();

        await dispatch(getCurrentUser({})).unwrap();

        toast.success("Email verified successfully");
        navigate("/");
      } catch (error) {
        toast.error(error || "Invalid or expired verification link");
        navigate("/login");
      }
    };

    verifyEmailAsync();
  }, [token, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">
        Verifying your email, please wait...
      </p>
    </div>
  );
};

export default VerifyingEmail;
