import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser, clearError, loginWithGoogle } from "../features/auth/authSlice.js";
import Button from "../components/shared/Button/Button";
import Input from "../components/shared/Input/Input";
import FileUpload from "../components/shared/FileUpload/FileUpload";
import Logo from "../components/shared/Logo/Logo";
import Container from "../components/shared/Container/Container";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFileType,
  validateFileSize
} from "../utils/validators.js";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ========== VALIDATIONS ==========
    const emailCheck = validateEmail(formData.email);
    const usernameCheck = validateUsername(formData.username);
    const passwordCheck = validatePassword(formData.password);
    const avatarTypeCheck = validateFileType(avatar, ["image/*"]);
    const avatarSizeCheck = validateFileSize(avatar, 5);

    if (!emailCheck.isValid) return stop(emailCheck.message);
    if (!usernameCheck.isValid) return stop(usernameCheck.message);
    if (!passwordCheck.isValid) return stop(passwordCheck.message);
    if (!avatarTypeCheck.isValid) return stop(avatarTypeCheck.message);
    if (!avatarSizeCheck.isValid) return stop(avatarSizeCheck.message);

    function stop(msg) {
      setIsSubmitting(false);
      toast.error(msg);
      return;
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (avatar) data.append("avatar", avatar);
    if (coverImage) data.append("coverImage", coverImage);

    dispatch(registerUser(data))
      .unwrap()
      .then(() => {
        toast.success("Account created! Please verify your email 📩");
        navigate("/verifyEmailInfo", {
          state: { email: formData.email },
        });
      })
      .catch((err) => {
        toast.error(err || "Registration failed");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // ========== GOOGLE ==========
  const handleGoogleSuccess = (response) => {
    setIsGoogleSubmitting(true);
    dispatch(loginWithGoogle({ idToken: response.credential }))
      .unwrap()
      .then(() => {
        toast.success("Logged in with Google");
        navigate("/");
      })
      .catch(() => {
        toast.error("Google login failed");
        setIsGoogleSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 transition-colors duration-300">
      <Container maxWidth="sm">
        <div className="space-y-8">
          <div className="text-center">
            <Logo size="lg" className="mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link to="/login" className="text-indigo-600 font-medium">
                sign in
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Desktop: 2 Column Grid for Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Full Name" name="fullName" onChange={handleInputChange} required />
                <Input label="Username" name="username" onChange={handleInputChange} required />
                <Input label="Email" name="email" type="email" onChange={handleInputChange} required />
                <Input 
                  label="Password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  onChange={handleInputChange}
                  icon={showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  iconPosition="right"
                  onIconClick={() => setShowPassword(!showPassword)}
                  required 
                />
            </div>

            {/* Desktop: 2 Column Grid for Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-1">
                    <FileUpload label="Profile Picture" required onFileChange={setAvatar} className="h-full" />
                </div>
                <div className="md:col-span-1">
                    <FileUpload label="Cover Image" onFileChange={setCoverImage} className="h-full" />
                </div>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="flex justify-center mt-4">
            {isGoogleSubmitting ? (
              <div className="flex justify-center items-center p-2">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : (
              <GoogleLogin onSuccess={handleGoogleSuccess} />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SignUp;
