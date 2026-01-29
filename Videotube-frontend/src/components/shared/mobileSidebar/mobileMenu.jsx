import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../Avatar/Avatar";
import { ImHome } from "react-icons/im";
import {
  MdSubscriptions,
  MdWatchLater,
  MdSpaceDashboard
} from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { RiPlayList2Line, RiVideoUploadFill } from "react-icons/ri";
import { useTheme } from "../../../context/ThemeContext";
import { Sun, Moon, X } from "lucide-react"; 

function MobileMenu({ open, onClose, onLogout }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // Use Theme
  const subscriberId = user?._id;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer - Reduced Width */}
      <aside className="fixed top-0 left-0 h-full w-[240px] bg-white dark:bg-slate-900 z-[70] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
             <span className="font-bold text-xl text-gradient">Menu</span>
             {/* Theme Toggle Inside Menu */}
             <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800"
             >
                {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-indigo-600" />}
             </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* You (Channel) */}
        {isAuthenticated && (
          <Link
            to={`/channel/${user?.username}`}
            onClick={onClose}
            className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
               <Avatar src={user?.avatar} size="sm" className="ring-2 ring-transparent group-hover:ring-indigo-500" />
               <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{user?.fullName || "User"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">@{user?.username}</span>
               </div>
            </div>
          </Link>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <MenuItem to="/" icon={<ImHome />} label="Home" onClick={onClose} isActive={location.pathname === "/"} />
          {isAuthenticated && (
            <>
              <MenuItem to="/upload" icon={<RiVideoUploadFill />} label="Upload Video" onClick={onClose} isActive={location.pathname === "/upload"} />
              <MenuItem to={`/subscriptions/${user?._id}`} icon={<MdSubscriptions />} label="Subscriptions" onClick={onClose} isActive={location.pathname.includes("/subscriptions")} />
              <MenuItem to="/history" icon={<FaHistory />} label="History" onClick={onClose} isActive={location.pathname === "/history"} />
              <MenuItem to="/videos" icon={<BiSolidLike />} label="Liked Videos" onClick={onClose} isActive={location.pathname === "/videos"} />
              <MenuItem to={`/playlists/${user?._id}`} icon={<RiPlayList2Line/>} label="Playlists" onClick={onClose} isActive={location.pathname.includes("/playlists")} /> 
              {/* <MenuItem to="/watch-later" icon={<MdWatchLater />} label="Watch Later" onClick={onClose} isActive={location.pathname === "/watch-later"} /> */}
              <MenuItem to="/dashboard" icon={<MdSpaceDashboard />} label="Dashboard" onClick={onClose} isActive={location.pathname === "/dashboard"} />
            </>
          )}
        </nav>

        {/* Logout */}
        {isAuthenticated && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors"
            >
              <FaArrowRightFromBracket size={20} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function MenuItem({ to, icon, label, onClick, isActive }) {
  // Use the same styling logic as Sidebar.jsx
  const activeClass = "bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20";
  const inactiveClass = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400";

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? activeClass : inactiveClass}`}
    >
      <span className={`text-xl ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export default MobileMenu;
