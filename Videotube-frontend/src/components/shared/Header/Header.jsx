import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { logoutUser } from "../../../features/auth/authSlice";
import { searchVideos } from "../../../features/video/videoSlice";
import { toggleSidebar } from "../../../features/ui/uiSlice";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { X, Sun, Moon, Menu, ArrowLeft } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

import Logo from "../Logo/Logo";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import LogoutConfirmationModal from "../LogoutConfirmationModal";
import MobileMenu from "../mobileSidebar/mobileMenu";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const searchSuggestions = useSelector(
    (state) => state.video.searchSuggestions || []
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("query") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchText || searchText.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      dispatch(searchVideos({ query: searchText, limit: 6 }));
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [searchText, dispatch]);

  useEffect(() => {
    if (searchSuggestions.length) {
      setSuggestions(
        searchSuggestions.map((v) => v.title).filter(Boolean).slice(0, 6)
      );
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
  }, [searchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    if (q) {
      if (window.location.pathname !== '/') {
        navigate(`/?query=${encodeURIComponent(q)}`);
      } else {
        setSearchParams({ query: q, page: 1 });
      }
    } else {
        setSearchParams({});
    }
    setShowSuggestions(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchText("");
    if (window.location.pathname === '/') {
        setSearchParams({});
    }
    searchInputRef.current?.focus();
  };

  /* ================= LOGOUT LOGIC ================= */
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const confirmLogout = async () => {
    try {
      setIsLogoutModalOpen(false);
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ================= MENU BUTTON ================= */
  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(true);
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
          
          {/* LEFT SECTON: MENU AND LOGO */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleMenuClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <Menu size={22} /> {/* Smaller Menu Icon */}
            </button>

            <div className="transform origin-left">
              <Logo size="md" />
            </div>
          </div>

          {/* ... (Search hidden on mobile) ... */}

          {/* RIGHT SECTION: ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Theme Toggle - Desktop Only */}
             <button 
                onClick={toggleTheme}
                className="hidden md:block p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
             >
                {theme === 'dark' ? <Sun size={22} className="text-yellow-400 fill-yellow-400/20" /> : <Moon size={22} className="text-indigo-600 fill-indigo-600/20" />}
             </button>

             {/* Mobile Actions: Search First, then Gradient Plus */}
             <div className="flex md:hidden items-center gap-2">
                {isAuthenticated && (
                   <>
                     <button onClick={() => setIsMobileSearchOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
                        <FiSearch size={22} />
                     </button>
                     
                     {/* Gradient Upload Button */}
                     <Link to="/upload" className="p-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-md shadow-indigo-500/20">
                        <FaPlus size={18} />
                     </Link>
                   </>
                )}
                {!isAuthenticated && (
                    <Link to="/login">
                        <Button variant="primary" size="sm" className="px-4 py-1.5 h-auto text-xs">Login</Button>
                    </Link>
                )}
                 {isAuthenticated && (
                     <Link to="/profile">
                      <Avatar size="xs" src={user?.avatar} className="w-8 h-8 ml-1" />
                     </Link>
                 )}
             </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <MobileMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogoutClick}
      />

      {/* ===== MOBILE SEARCH OVERLAY ===== */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-top-10 duration-200 flex flex-col">
            <div className="flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800 gap-3 shrink-0">
                 <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400">
                    <ArrowLeft size={24} />
                 </button>
                 <form onSubmit={handleSearch} className="flex-1 relative flex items-center bg-gray-100 dark:bg-slate-800 rounded-full px-4 py-2">
                    <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" size={20} />
                    <input
                      autoFocus
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none min-w-0" // min-w-0 ensures flex child shrinks properly
                    />
                    {searchText && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchText("");
                                // We don't have a direct ref to this mobile input, but since it's autoFocus it might be okay.
                                // If needed we could use document.getElementById or a dedicated ref.
                            }}
                            className="ml-2 text-gray-500 dark:text-gray-400 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                        >
                            <X size={18} />
                        </button>
                    )}
                 </form>
            </div>
            
            {/* Mobile Suggestions List */}
            <div className="flex-1 overflow-y-auto p-2">
                {suggestions.length > 0 && (
                    <div className="space-y-1">
                        {suggestions.map((s, i) => (
                          <div
                            key={i}
                            onClick={() => {
                                setSearchText(s);
                                if (window.location.pathname !== '/') {
                                    navigate(`/?query=${encodeURIComponent(s)}`);
                                } else {
                                    setSearchParams({ query: s, page: 1 });
                                }
                                setIsMobileSearchOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <FiSearch className="text-gray-400 dark:text-gray-500" size={18} />
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{s}</span>
                          </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}

      {/* ===== LOGOUT MODAL ===== */}
      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default Header;
