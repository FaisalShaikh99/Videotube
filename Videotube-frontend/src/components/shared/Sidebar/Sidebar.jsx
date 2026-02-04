import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../Avatar/Avatar";

import { ImHome } from "react-icons/im";
import { MdSubscriptions, MdSpaceDashboard, MdWatchLater } from "react-icons/md";
import { FaHistory, FaUserCircle } from "react-icons/fa";
import { BiSolidLike, BiInfoCircle } from "react-icons/bi";
import { RiPlayList2Line, RiVideoUploadFill } from "react-icons/ri";
import { toast } from "react-toastify";

function Sidebar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  const subscriberId = user?._id;

  /* ===================== NAV ITEMS ===================== */

  const mainNavItems = [
    { path: "/",
      icon: <ImHome />, 
      label: "Home", 
      requiresAuth: false 
    },
    {
      path: `/subscriptions/${subscriberId}`,
      icon: <MdSubscriptions />,
      label: "Subscriptions",
      requiresAuth: true,
    },
  ];

  const guestNavItems = [
    { path: "/", icon: <ImHome />, label: "Home" },
    { path: "/subscriptions-guest", icon: <MdSubscriptions />, label: "Subscriptions", isProtected: true },
    { path: "/you-guest", icon: <FaUserCircle />, label: "You", isProtected: true },
    { path: "/history-guest", icon: <FaHistory />, label: "History", isProtected: true },
  ];

  const userNavItems = [
    { path: "/history", icon: <FaHistory />, label: "History" },
    { path: "/videos", icon: <BiSolidLike />, label: "Liked Videos" },
    { path: `/playlists/${user?._id}`, icon: <RiPlayList2Line />, label: "Playlists" },
  ];

  const creatorNavItems = [
    { path: "/upload", icon: <RiVideoUploadFill />, label: "Upload Video" },
    { path: "/dashboard", icon: <MdSpaceDashboard />, label: "Dashboard" },
  ];

  /* ===================== SHARED ITEMS (Always Visible) ===================== */
  const commonNavItems = [
    { path: "/about", icon: <BiInfoCircle />, label: "About" },
  ];

  const shouldShowItem = (item) =>
    !item.requiresAuth || isAuthenticated;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const active = isActive(path);
    const base = "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden";
    
    // Gradient active state
    if (active) {
      return `${base} bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 scale-105`;
    }
    
    return `${base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400`;
  };

  const handleGuestClick = (e, item) => {
    if (item.isProtected) {
      e.preventDefault();
      toast.info("Please sign in to access this feature", {
        position: "bottom-left",
        autoClose: 3000,
        theme: "colored"
      });
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <aside
      className={`hidden lg:block fixed left-0 top-16 bottom-0 z-40
      bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800
      transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar
      ${isSidebarOpen ? "w-56" : "w-16"}`}
    >
      <div className="p-4 space-y-6">

        {/* ========== MAIN / MINI MENU (Always Visible) ========== */}
        {/* ========== MAIN MENU ========== */}
        <nav className="space-y-2">
          {isAuthenticated ? (
            /* LOGGED IN USER - Main Items */
            mainNavItems.filter(shouldShowItem).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${getLinkClasses(item.path)} ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <span className={`text-xl ${!isSidebarOpen ? "mb-0" : "mr-4"}`}>{item.icon}</span>
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            ))
          ) : (
            /* GUEST USER - Guest Items */
            <>
              {guestNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => handleGuestClick(e, item)}
                  className={`${getLinkClasses(item.path)} ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                  title={!isSidebarOpen ? item.label : ""}
                >
                  <span className={`text-xl ${!isSidebarOpen ? "mb-0" : "mr-4"}`}>{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              ))}
              {/* Common Items for Guest */}
              {commonNavItems.map((item) => (
                 <Link
                  key={item.path}
                  to={item.path}
                  className={`${getLinkClasses(item.path)} ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                  title={!isSidebarOpen ? item.label : ""}
                 >
                   <span className={`text-xl ${!isSidebarOpen ? "mb-0" : "mr-4"}`}>{item.icon}</span>
                   {isSidebarOpen && <span>{item.label}</span>}
                 </Link>
              ))}
            </>
          )}
        </nav>

        {/* ========== FULL MENU (Only when OPEN) ========== */}
        {isSidebarOpen && isAuthenticated && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            {/* ===== YOU ===== */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                You
              </h3>
              <nav className="space-y-1">
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={getLinkClasses(item.path)}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ===== CREATOR ===== */}
             <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
              <h3 className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Creator Studio
              </h3>
              <nav className="space-y-1">
                {creatorNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={getLinkClasses(item.path)}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ===== COMMON (Visible to Logged In) ===== */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
                <nav className="space-y-1">
                    {commonNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={getLinkClasses(item.path)}
                        >
                            <span className="mr-4 text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ===== PROFILE ===== */}
            {user && (
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  to={`/channel/${user.username}`}
                  className="flex items-center px-3 py-3 rounded-xl
                  hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <Avatar
                    size="sm"
                    src={user.avatar}
                    alt={user.username}
                    className="ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                    fallback={user.username?.charAt(0).toUpperCase()}
                  />
                  <div className="ml-3 overflow-hidden">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">{user.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      View Channel
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
