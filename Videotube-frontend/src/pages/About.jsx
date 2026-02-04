import React from 'react';
import { 
  Rocket, 
  Code, 
  Server, 
  Database, 
  Layers, 
  Heart,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import Container from '../components/shared/Container/Container';

function About() {
  return (
    <Container className="py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            About VideoTube
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            VideoTube is a video streaming platform inspired by YouTube, built as a full-stack learning project.
          </p>
        </div>

        {/* 2. Project Introduction */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-indigo-500/5 border border-indigo-50 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Globe size={32} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">The Platform</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VideoTube is a YouTube-inspired application designed to provide a seamless video discovery experience. 
                We believe in accessibility — that's why <strong>users can explore, search, and watch videos completely guest-free.</strong>
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 rounded-r-xl">
                 <p className="text-sm text-gray-800 dark:text-gray-200">
                   <strong>Note:</strong> While browsing is open to everyone, advanced interactions like 
                   <span className="font-semibold text-orange-600 dark:text-orange-400"> Liking, Subscribing, Saving, and Commenting </span> 
                   require a secure login to ensure authentic engagement.
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Project Journey */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-indigo-500/5 border border-purple-50 dark:border-slate-800">
           <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
              <Rocket size={32} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">The Journey</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This project kicked off in <strong>August 2025</strong> as a dedicated effort to master full-stack development. 
                It represents my <strong>first mega MERN stack project</strong>, bridging the gap between theory and production-grade software.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-2">
                <li>Backend architecture inspired by the robust "Chai aur Code" backend series.</li>
                <li>Frontend crafted with modern AI assistance and heavily inspired by YouTube's proven UX/UI standards.</li>
                <li>Driven by original problem-solving and architectural decisions.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tech Stack Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            
            {/* 4. Frontend Tech */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-md border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <Code className="text-blue-500" size={28} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frontend Magic</h2>
                </div>
                <ul className="space-y-3">
                    {[
                        { name: "React + Vite", desc: "For blazing fast performance and component-based UI." },
                        { name: "Redux Toolkit", desc: "Robust global state management." },
                        { name: "Tailwind CSS", desc: "Rapid, responsive, and beautiful styling." },
                        { name: "Axios", desc: "Optimized API communication with interceptors." },
                        { name: "React Router", desc: "Smooth, client-side navigation." },
                        { name: "Authentication", desc: "Secure JWT handling & Google OAuth." },
                        { name: "Toastify", desc: "Interactive feedback for user actions." },
                    ].map((tech, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                            <span className="text-gray-600 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{tech.name}:</strong> {tech.desc}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 5. Backend Tech */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-md border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <Server className="text-green-500" size={28} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Backend Power</h2>
                </div>
                <ul className="space-y-3">
                    {[
                        { name: "Node.js & Express", desc: "Scalable server-side runtime." },
                        { name: "MongoDB & Mongoose", desc: "Flexible NoSQL schema design." },
                        { name: "JWT Auth", desc: "Stateless, secure user sessions." },
                        { name: "Multer & Cloudinary", desc: "Professional media upload & handling." },
                        { name: "Bcrypt", desc: "Industry-standard password hashing." },
                        { name: "Aggregation Pipelines", desc: "Complex data queries made efficient." },
                        { name: "Nodemailer", desc: "Reliable transactional emails." },
                    ].map((tech, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                            <span className="text-gray-600 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{tech.name}:</strong> {tech.desc}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>

        {/* 6. Learning & Purpose */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="relative z-10 space-y-6">
                <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                    <Heart className="text-pink-400" size={32} fill="currentColor" />
                </div>
                <h2 className="text-3xl font-bold">Built for Learning, Designed for Performance</h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    VideoTube is more than just code; it's a testament to understanding the complexities of modern web systems. 
                    From secure authentication flows to handling complex media streams, every feature was built to solve a real-world engineering challenge.
                </p>
                <div className="pt-4">
                    <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                        "This project is created for learning and portfolio purposes."
                    </p>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        </section>

      </div>
    </Container>
  );
}

export default About;
