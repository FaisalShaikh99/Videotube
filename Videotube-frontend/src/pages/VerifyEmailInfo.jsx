import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <svg
              className="w-10 h-10 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your email
        </h2>

        <p className="text-gray-600 mb-8">
          We’ve sent a verification link to <span className="font-medium text-gray-900">{email}</span>.
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="space-y-3">
          <button
            onClick={openInbox}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium shadow-sm hover:shadow"
          >
            Open Gmail Inbox
          </button>

          <button
            onClick={resendVerification}
            disabled={loading}
            className="w-full bg-white text-indigo-600 border border-indigo-200 py-2.5 rounded-lg hover:bg-indigo-50 transition duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
