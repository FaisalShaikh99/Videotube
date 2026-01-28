import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, forgotPassword } from "../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/shared/Button/Button";
import AuthLayout from "../layout/auth/authLayout";
import AuthCard from "../layout/auth/authCard";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

function VerifyOtp() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputsRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useParams();

  const { error } = useSelector((state) => state.auth);

  /* ⏱️ Timer */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* OTP change */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* Backspace */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* Submit */
  const handleSubmit = (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) {
      toast.error("Enter complete OTP");
      return;
    }

    setIsSubmitting(true);

    dispatch(verifyOTP({ email, otp: otpValue }))
      .unwrap()
      .then(() => {
        toast.success("OTP verified successfully");
        navigate(`/reset-password/${email}`);
      })
      .catch((err) => toast.error(err))
      .finally(() => setIsSubmitting(false));
  };

  /* 🔁 Resend OTP */
  const handleResend = () => {
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        toast.success("OTP resent successfully");
        setOtp(Array(OTP_LENGTH).fill(""));
        setTimer(60);
        inputsRef.current[0].focus();
      })
      .catch((err) => toast.error(err));
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Verify OTP"
        subtitle={`Enter the 6-digit OTP sent to ${email}`}
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            ))}
          </div>

          {/* Timer & Resend */}
          <div className="text-center text-sm">
            {timer > 0 ? (
              <span className="text-gray-500">
                Resend OTP in <b>{timer}s</b>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-indigo-600 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            Verify OTP
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default VerifyOtp;
