import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import { Instagram, Github, Linkedin, Youtube } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* ============= COMPANY INFO ============= */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <Logo size="lg" className="text-indigo-400" />
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Share your videos with the world. Upload, watch, and discover amazing content on VideoTube.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Media Links */}
                            <a 
                                href="https://www.youtube.com/@faisal_shaikh0909" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                            >
                                <Youtube size={24} />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                            >
                                <Instagram size={24} />
                            </a>
                            <a 
                                href="https://github.com/FaisalShaikh99" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                            >
                                <Github size={24} />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/faisal-shaikh%F0%9F%AB%A1-9a2716306/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                            >
                                <Linkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* ============= QUICK LINKS ============= */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/upload" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Upload Video
                                </Link>
                            </li>
                            <li>
                                <Link to="/videos" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Liked Videos
                                </Link>
                            </li>
                            <li>
                                <Link to="/history" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    History
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ============= SUPPORT ============= */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                        <ul className="space-y-2">
                             <li>
                                <Link to="/profile" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Channel Settings
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@videotube.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ============= BOTTOM BAR ============= */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2026 VideoTube. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Terms
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
