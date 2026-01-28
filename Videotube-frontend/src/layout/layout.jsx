import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/shared/Header/Header";
import Footer from "../components/shared/Footer/Footer";
import Sidebar from "../components/shared/Sidebar/Sidebar";
import { useSelector } from "react-redux";

function Layout() {
    const { isSidebarOpen } = useSelector((state) => state.ui);
    const location = useLocation();

    // Logic to hide footer on specific pages
    const isVideoPage = location.pathname.startsWith("/video/");
    const isDashboard = location.pathname === "/dashboard";
    const isUpload = location.pathname === "/upload";

    const shouldHideFooter = isVideoPage || isDashboard || isUpload;

  return (
    //  Whole screen lock (NO BODY SCROLL)
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">

      <Header />

      {/* ============= BODY AREA ============= */}
      <div className="flex flex-1 pt-16">

        {/* ============= SIDEBAR (FIXED) ============= */}     
        <Sidebar />
      
        {/* ============= MAIN CONTENT ============= */}
        <main 
          id="main-content"
          className={`flex-1 flex flex-col min-h-[calc(100vh-64px)] transition-all duration-300
          ${isSidebarOpen ? "lg:ml-56" : "lg:ml-16"}
          w-full`}
        >
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-1 md:py-1">
             <Outlet />
          </div>
          {!shouldHideFooter && <Footer />}
        </main>

      </div>
    </div>
  );
}

export default Layout;
