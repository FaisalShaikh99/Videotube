import React from 'react';
import Container from '../components/shared/Container/Container';

function About() {
  return (
    <Container className="py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            About VideoTube
          </h1>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-indigo-500/5 border border-indigo-50 dark:border-slate-800 space-y-6">
           
           <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
             <strong>VideoTube</strong> is a full-stack MERN mega project started in <strong>August 2025</strong>. 
             It is designed to replicate the core functionality and user experience of modern video streaming platforms like YouTube.
           </p>

           <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl">
                 <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Backend</h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Learned and adapted from the <strong>"Chai aur Code"</strong> backend series, implementing robust APIs, secure authentication, and complex data aggregation.
                 </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl">
                 <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Frontend</h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Built using AI assistance, inspired by <strong>YouTube's UI/UX</strong>, and enhanced with original design ideas to create a premium, responsive interface.
                 </p>
              </div>
           </div>

           <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-300 mb-2">Project Goal</h3>
              <p className="text-indigo-800 dark:text-indigo-200">
                This project is built strictly for <strong>learning and portfolio purposes</strong>. It demonstrates end-to-end full-stack development skills, from database design to client-side state management.
              </p>
           </div>
           
           <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
             <p className="text-sm text-gray-500 dark:text-gray-400 italic">
               <strong>Disclaimer:</strong> This project is independently built for educational purposes and is not affiliated with or endorsed by YouTube or Google.
             </p>
           </div>

        </div>

      </div>
    </Container>
  );
}

export default About;
