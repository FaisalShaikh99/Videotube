import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, Link } from "react-router-dom";
import Logo from "../components/shared/Logo/Logo.jsx"

const VerifyEmailInfo = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;

  const resendVerification = async () => {
    if (!email) {
      toast.error("Email address not found. Please try registering again.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/resend-verification-email`,
        { email }
      );
      toast.success("Verification email resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  const openInbox = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="bg-[#1E1E1E] p-8 rounded-lg shadow-lg max-w-md w-full text-center border border-gray-700">
        <div className="mb-6 flex justify-center">
            <Logo />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Verify your email
        </h2>

        <p className="text-gray-400 mb-8">
          We’ve sent a verification link to <span className="font-medium text-white">{email}</span>.
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="space-y-3">
          <button
            onClick={openInbox}
            className="w-full bg-[#ae7aff] text-black py-2.5 rounded-lg hover:bg-[#ae7aff]/90 transition duration-200 font-bold shadow-sm hover:shadow"
          >
            Open Gmail Inbox
          </button>

          <button
            onClick={resendVerification}
            disabled={loading}
            className="w-full bg-transparent text-gray-300 border border-gray-600 py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Resend Email"}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailInfo;
