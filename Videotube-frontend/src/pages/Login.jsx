import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';

import { loginUser, loginWithGoogle, clearError } from '../features/auth/authSlice'; 
import Button from '../components/shared/Button/Button';
import Input from '../components/shared/Input/Input';
import Logo from '../components/shared/Logo/Logo';
import Container from '../components/shared/Container/Container';
import { validateEmail, validatePassword } from '../utils/validators';
import { toast } from 'react-toastify';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isAuthenticated } = useSelector(state => state.auth);

    // clear error
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    // isAuthenticated then navigate to home page
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) dispatch(clearError());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const emailCheck = validateEmail(formData.email);
        const passwordCheck = validatePassword(formData.password);

        if (!emailCheck.isValid || !passwordCheck.isValid) {
            setIsSubmitting(false);
            return;
        }

        dispatch(loginUser(formData))
            .unwrap()
            .then(() => {
                toast.success("Successfully logged in");
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                toast.error(err || "Login failed");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleGoogleSuccess = (response) => {
        const idToken = response.credential; // Google JWT Token
        setIsGoogleSubmitting(true);

        dispatch(loginWithGoogle({ idToken })) 
            .unwrap()
            .then(() => {
                toast.success("Successfully Logged in with Google");
                navigate('/');
            })
            .catch((err) => {
                toast.error("Google login failed via Redux:",err);
                setIsGoogleSubmitting(false);
            });
    };
    
    // GOOGLE FAILURE HANDLER
    const handleGoogleFailure = (error) => {
        console.error("Google Login Failed:", error);
        toast.error("Google login failed. Check console for details.");
    };

  

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
            <Container maxWidth="sm">
                <div className="space-y-8">
                    <div className="text-center">
                        <Logo size="lg" className="mx-auto mb-4" />
                        <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                create a new account
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <h3 className="text-sm font-medium text-red-800">Login failed</h3>
                            <div className="mt-2 text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email or Username"
                            type="text"
                            name="email"
                            placeholder="Enter your email or username"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            icon={showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            iconPosition="right"
                            onIconClick={() => setShowPassword(!showPassword)}
                            required
                        />

                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* GOOGLE LOGIN BUTTON (Using @react-oauth/google) */}
                    {/* GOOGLE LOGIN BUTTON (Using @react-oauth/google) */}
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
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                size='large'
                                theme='outline'
                            />
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Login;