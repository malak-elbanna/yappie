import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRedo, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import hero from '../assets/hero.png';
import { useNavigate, Link } from 'react-router-dom';
import API from '../Stream';


export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const togglePlayback = () => setIsPlaying(!isPlaying);    

  useEffect(() => {
      API.get('/books/')
        .then(res => {
          setBooks(res.data);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

  <section className="bg-gradient-to-br from-indigo-900 to-purple-900 py-12 md:py-20">
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-full md:w-2/5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-indigo-500/30 blur-xl rounded-lg transform group-hover:scale-105 transition-all duration-300"></div>
            <img
              src={hero}
              alt="Seeing What's Invisible by Walt Brown"
              className="relative z-10 max-w-xs w-full rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </div>

        <div className="w-full md:w-3/5 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 mb-2">
              Listen Now
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold">On Yappie</h2>
          </div>

          <div className="space-y-3">
            <div className="w-full bg-gray-700/50 h-1.5 rounded-full">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-purple-400 h-1.5 rounded-full" 
                style={{ width: '30%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>0:47</span>
              <span>3:21</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <FaStepBackward size={20} />
            </button>
            <button
              className="bg-white text-indigo-900 p-3 rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/30"
              onClick={togglePlayback}
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              <FaStepForward size={20} />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              <FaRedo size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  </section>

  <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-gray-950">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { count: "5540+", label: "Books", page: "/books" },
          { count: "375+", label: "Streams", page: "/streams" },
          { count: "2000+", label: "Users", page: "/"}
        ].map((stat, index) => (
          <div 
            key={index} 
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/10 text-center"
          >
            <h3 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              {stat.count}
            </h3>
            <p className="text-xl text-gray-300 mb-6">{stat.label}</p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-8 rounded-full transition-all shadow-md hover:shadow-indigo-500/30"
              onClick={() => {navigate(stat.page)}}
            >
              {stat.label === "Users" ? "Subscribe now" : "Explore more"}
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section className="py-12 md:py-16 bg-gray-950">
  <div className="container mx-auto px-4 md:px-6">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
        Explore our books
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Discover our curated collection of audiobooks across various genres
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ) : (
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {books && books.slice(0, 6).map((book) => (
            <div 
              key={book._id}
              className="group relative h-full"
            >
              <div className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-200" onClick={() => navigate(`/books/${book._id}`)}>
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="mt-3 p-2 transition-all duration-300 group-hover:bg-gray-800/50 group-hover:rounded-lg">
                <h3 className="text-white font-bold text-sm md:text-base line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-purple-300 text-xs md:text-sm">
                  By {book.author}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-purple-300">
                    {book.category || "General"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>

  <section className="py-12 md:py-16 bg-gradient-to-br from-gray-900 to-gray-950">
    <div className="container mx-auto px-4 md:px-6">
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-gray-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Unlimited Access to Audiobooks & Podcasts
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe now for unlimited access to audiobooks and podcasts! Enjoy high-quality audio,
            offline listening, and exclusive content.
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/30">
            Subscribe now
          </button>
        </div>
      </div>
    </div>
  </section>
</div>
  );
}
