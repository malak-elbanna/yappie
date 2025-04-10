import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import heroImage from '../assets/home hero.jpg';
import logo from '../assets/logo.jpeg';
import axios from 'axios';

const Home = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRandomBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/random-books');
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch books');
                setLoading(false);
                console.error('Error fetching books:', err);
            }
        };

        fetchRandomBooks();
    }, []);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
            {/* Navigation Bar */}
            <nav className="bg-black p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <a href="/" className="flex items-center">
                            <img src={logo} alt="Yappie Logo" className="h-10 w-auto" />
                        </a>
                        <div className="hidden md:flex space-x-6">
                            <a href="/" className="text-white hover:text-purple-400">Home</a>
                            <a href="/books" className="text-white hover:text-purple-400">Books</a>
                            <a href="/categories" className="text-white hover:text-purple-400">Categories</a>
                            <a href="/products" className="text-white hover:text-purple-400">Products</a>
                            <a href="/about" className="text-white hover:text-purple-400">About us</a>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-gray-800 text-white px-4 py-2 rounded-full w-64 focus:outline-none"
                            />
                            <FiSearch className="absolute right-4 top-3 text-gray-400" />
                        </div>
                        <a href="/signup" className="text-white hover:text-purple-400">Sign up</a>
                        <a href="/login" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">
                            Login
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative h-[80vh] overflow-hidden">
                <img
                    src={heroImage}
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative container mx-auto px-4 h-full flex items-center justify-end">
                    <div className="w-1/2">
                        <h1 className="text-white text-5xl font-bold mb-6">Listen Now On Yappie</h1>
                        {/* Audio Player */}
                        <div className="bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-sm w-[400px]">
                            <div className="flex justify-between items-center mb-3">
                                <button className="text-white hover:text-purple-400">
                                    <FaStepBackward size={20} />
                                </button>
                                <button 
                                    className="text-white hover:text-purple-400"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                                </button>
                                <button className="text-white hover:text-purple-400">
                                    <FaStepForward size={20} />
                                </button>
                            </div>
                            <div className="w-full">
                                <div className="bg-gray-700 h-1 rounded-full">
                                    <div className="bg-purple-600 h-1 w-1/3 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-900 p-6 rounded-xl text-center">
                        <h3 className="text-white text-4xl font-bold mb-2">5540+</h3>
                        <p className="text-gray-400 mb-4">Books</p>
                        <button className="text-purple-400 hover:text-purple-300">Explore more</button>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl text-center">
                        <h3 className="text-white text-4xl font-bold mb-2">375+</h3>
                        <p className="text-gray-400 mb-4">Podcasts</p>
                        <button className="text-purple-400 hover:text-purple-300">Explore more</button>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl text-center">
                        <h3 className="text-white text-4xl font-bold mb-2">2000+</h3>
                        <p className="text-gray-400 mb-4">Users</p>
                        <button className="text-purple-400 hover:text-purple-300">Explore more</button>
                    </div>
                </div>
            </div>

            {/* Explore Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-white text-2xl font-bold mb-8">Explore Books</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center">
                            <div className="text-white">Loading books...</div>
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center">
                            <div className="text-red-500">{error}</div>
                        </div>
                    ) : (
                        books.map((book) => (
                            <div key={book.id || book._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                                <div className="aspect-w-2 aspect-h-3">
                                    {book.cover_image ? (
                                        <img 
                                            src={book.cover_image} 
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                            <span className="text-gray-400">No Cover</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-medium text-lg mb-1 truncate">{book.title}</h3>
                                    <p className="text-gray-400 text-sm">{book.author}</p>
                                    {book.genre && (
                                        <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded mt-2">
                                            {book.genre}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Subscribe Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-gray-900 p-8 rounded-xl text-center">
                    <h2 className="text-white text-2xl font-bold mb-4">Subscribe Now</h2>
                    <p className="text-gray-400 mb-6">
                        Subscribe now for unlimited access to audiobooks and podcasts! Enjoy your favorite titles anytime, anywhere.
                    </p>
                    <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700">
                        Subscribe Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home; 