import React from 'react';
import Logo from '../Logo/Logo';
import Spinner from '../Spinner/Spinner';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo Container with Glow */}
        <div className="relative flex items-center justify-center">
             {/* Background Glow */}
             <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl animate-pulse"></div>
             
             {/* Actual Logo - Scaled Up slightly */}
             <div className="transform scale-125 z-10">
                <Logo size="xl" to={null} />
             </div>
        </div>
        
        {/* Loading Indicator */}
         <div className="flex flex-col items-center gap-3">
             <Spinner size="md" color="indigo" />
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide animate-pulse">
                Loading...
             </p>
         </div>
      </div>
    </div>
  );
};

export default PageLoader;
