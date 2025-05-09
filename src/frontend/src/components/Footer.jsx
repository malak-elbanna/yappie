import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Yappie</h3>
                    <p className="text-gray-400">
                        Your premium destination for audiobooks and podcasts.
                    </p>
                </div>
            
            <div>
                <h4 className="text-lg font-medium mb-4 text-white">Quick Links</h4>
                <nav className="space-y-2">
                    {[
                    { name: 'Home', path: '/' },
                    { name: 'Books', path: '/books' },
                    { name: 'Categories', path: '/categories' },
                    { name: 'Available Streams', path: '/streams' },
                    { name: 'About us', path: '/about-us' }
                    ].map((link) => (
                    <Link 
                        key={link.name}
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors block"
                    >
                        {link.name}
                    </Link>
                    ))}
                </nav>
            </div>
            
            <div>
                <h4 className="text-lg font-medium mb-4 text-white">Connect With Us</h4>
                <div className="flex space-x-4 mb-6">
                    {[
                    { icon: <FaInstagram size={20} />, name: 'Instagram' },
                    { icon: <FaFacebook size={20} />, name: 'Facebook' },
                    { icon: <FaTwitter size={20} />, name: 'Twitter' }
                    ].map((social) => (
                    <a 
                        key={social.name}
                        href="#" 
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label={social.name}
                    >
                        {social.icon}
                    </a>
                    ))}
                </div>
                    <div className="space-y-2">
                        <p className="text-gray-400">Download the app</p>
                        <div className="flex space-x-3">
                        <button className="bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
                            <span className="text-white font-medium">App Store</span>
                        </button>
                        <button className="bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
                            <span className="text-white font-medium">Play Store</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()} Yappie. All rights reserved.
        </div>
        </div>
    </footer>
    );
}