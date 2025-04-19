import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRedo, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { getBooks } from '../Api'; 
import hero from '../assets/hero.png';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const togglePlayback = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getBooks();
        console.log(allBooks)
        setBooks(allBooks.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">

      <section className="bg-blue-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 opacity-30 blur-xl transform -translate-x-2 translate-y-2 rounded"></div>
                <img
                  src={hero}
                  alt="Seeing What's Invisible by Walt Brown"
                  className="relative z-10 max-w-xs w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Listen Now</h1>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">On Yappie</h2>

              <div className="mb-8">
                <div className="w-full bg-gray-700 h-1 rounded-full mb-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span>0:47</span>
                  <span>3:21</span>
                </div>
                <div className="flex justify-center space-x-6">
                  <button className="text-white hover:text-purple-400"><FaStepBackward size={24} /></button>
                  <button
                    className="bg-white text-blue-800 p-2 rounded-full hover:bg-purple-200"
                    onClick={togglePlayback}
                  >
                    {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
                  </button>
                  <button className="text-white hover:text-purple-400"><FaStepForward size={24} /></button>
                  <button className="text-white hover:text-purple-400"><FaRedo size={24} /></button>
                </div>
              </div>

              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4].map(slide => (
                  <button
                    key={slide}
                    className={`h-2 rounded-full ${currentSlide === slide ? 'w-6 bg-white' : 'w-2 bg-gray-400'}`}
                    onClick={() => setCurrentSlide(slide)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { count: "5540+", label: "Books" },
              { count: "375+", label: "Podcasts" },
              { count: "2000+", label: "Users" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-700 p-8 rounded text-center">
                <h3 className="text-3xl font-bold mb-2">{stat.count}</h3>
                <p className="text-xl mb-4">{stat.label}</p>
                <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded">
                  {stat.label === "Users" ? "Subscribe now" : "Explore more"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Explore our books</h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500 border-opacity-50"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((book, index) => (
                <div key={index} className="cursor-pointer transform hover:scale-105 transition-transform">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-auto rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 p-8 rounded">
            <h2 className="text-2xl font-bold mb-4">Subscribe Now</h2>
            <p className="mb-6">
              Subscribe now for unlimited access to audiobooks and podcasts! Enjoy high-quality audio,
              offline listening, and exclusive content.
            </p>
            <div className="flex justify-end">
              <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded">
                Subscribe now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-gray-800 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <nav className="flex flex-col space-y-2">
                <a href="#" className="hover:text-purple-400">Home</a>
                <a href="#" className="hover:text-purple-400">Books</a>
                <a href="#" className="hover:text-purple-400">Categories</a>
                <a href="#" className="hover:text-purple-400">About us</a>
                <a href="#" className="hover:text-purple-400">Podcasts</a>
              </nav>
            </div>
            <div>
              <p className="mb-2">Follow us on</p>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="hover:text-purple-400"><FaInstagram size={20} /></a>
                <a href="#" className="hover:text-purple-400"><FaFacebook size={20} /></a>
                <a href="#" className="hover:text-purple-400"><FaTwitter size={20} /></a>
              </div>
              <p className="mb-2">Download the app</p>
              <div className="bg-black inline-block px-2 py-1 rounded">
                <img src="/api/placeholder/100/30" alt="App Store" />
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 mt-8">
            Copyright © 2024. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
