import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmailInfo = () => {
  const [loading, setLoading] = useState(false);

  const resendVerification = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/resend-verification-email`
      );
      toast.success("Verification email resent");
    } catch (error) {
      toast.error("Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Verify your email
        </h2>

        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email address.
          Please check your inbox and click the link to activate your account.
        </p>

        <button
          onClick={resendVerification}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Didn’t receive the email? Check spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailInfo;
