import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Component Imports
import Input from "../components/shared/Input/Input";
import Button from "../components/shared/Button/Button";
import Spinner from "../components/shared/Spinner/Spinner";
import Avatar from "../components/shared/Avatar/Avatar";
import CoverImage from "../components/shared/CoverImage/CoverImage";
import Container from "../components/shared/Container/Container";

// Redux Action Imports
import {
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

// Icon for the upload UI
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
 

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State for image files and previews
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState(""); // Sirf preview ke liye

  // Refs for file inputs
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

 useEffect(() => {
  if (user) {
    setFullName(user.fullName || "");
    setUsername(user.username || "");
    setEmail(user.email || "");
    setAvatarPreview(user.avatar || "");

    // ONLY backend cover image
    setCoverPreview(user.coverImage || "");
  }
}, [user]);


  // Handle avatar file selection (backend ke liye)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        setIsSaving(true);
        await dispatch(updateUserAvatar(formData)).unwrap();
        toast.success("Avatar updated successfully");
      } catch (error) {
        toast.error(error?.message || "Failed to update avatar");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCoverChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setCoverPreview(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("coverImage", file);

  await dispatch(updateUserCoverImage(formData)).unwrap();
  toast.success("Cover image updated");
  };


  // Handle save button click (sirf backend data ke liye)
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatePromises = [];

      // Avatar upload is now handled immediately in handleAvatarChange
      
      if (
        user.fullName !== fullName ||
        user.username !== username ||
        user.email !== email
      ) {
        updatePromises.push(
          dispatch(updateAccountDetails({ fullName, username, email })).unwrap()
        );
      }
      
      if (updatePromises.length === 0) {
        toast.info("No new changes to save to the database.");
        setIsEditMode(false);
        setIsSaving(false);
        return;
      }

      await Promise.all(updatePromises);
      toast.success("Account details saved successfully!");
      setIsEditMode(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar || "");
      setAvatarFile(null);
    }
    setIsEditMode(false);
    setIsSaving(false);
  };

  // Edit Icon Component
  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
  
  // Show loading spinner while fetching user data initially
  if (status === 'loading' && !user) {
    return (
      <Container>
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-400">Loading your profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 p-4">

        <div className="w-full relative group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
          <CoverImage src={coverPreview} />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
             <CameraIcon />
          </div>
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        {/* === Avatar Upload UI (Backend) === */}
        <div className="relative -mt-16 group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
           <Avatar src={avatarPreview} alt={fullName} size="2xl" className="border-4 border-white shadow-lg"/>
           <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
             <CameraIcon />
           </div>
           <input
            type="file"
            ref={avatarInputRef}
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* === Form Fields === */}
        <div className="w-full max-w-md flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-semibold text-black mb-2">Account Details</h3>

          {/* Form Fields - Disabled when not in edit mode */}
          <div className="relative">
            <Input 
              label="Full Name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              disabled={!isEditMode}
            />
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="absolute right-3 top-[38px] text-blue-600 hover:text-blue-700 transition-colors"
                title="Edit full name"
              >
                <EditIcon />
              </button>
            )}
          </div>

          <div className="relative">
            <Input 
              label="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={!isEditMode}
            />
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="absolute right-3 top-[38px] text-blue-600 hover:text-blue-700 transition-colors"
                title="Edit username"
              >
                <EditIcon />
              </button>
            )}
          </div>

          <div className="relative">
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={!isEditMode}
            />
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="absolute right-3 top-[38px] text-blue-600 hover:text-blue-700 transition-colors"
                title="Edit email"
              >
                <EditIcon />
              </button>
            )}
          </div>

          {/* Save and Cancel Buttons - Only show in edit mode */}
          {isEditMode && (
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={handleSave} 
                className="mt-2 flex-1 bg-indigo-600 hover:bg-indigo-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button 
                variant="ghost"
                onClick={handleCancel} 
                className="mt-2 flex-1 bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-700 shadow-none border border-gray-300 dark:border-gray-700"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;