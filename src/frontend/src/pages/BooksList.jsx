import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import API from '../Stream';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [featured, setFeatured] = useState([]);
  const [current, setCurrent] = useState(0);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    API.get('/books/')
      .then(res => {
        setBooks(res.data);

        const byCategory = {};
        res.data.forEach(book => {
          if (!book.category) return;
          if (!byCategory[book.category]) byCategory[book.category] = [];
          byCategory[book.category].push(book);
        });
        setGrouped(byCategory);

        setFeatured(res.data.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === featured.length - 1 ? 0 : prev + 1));

  const handleSamplePlay = (bookId) => {
    if (audio) {
      audio.pause();
    }
    const audioElement = new Audio(`${API.defaults.baseURL}/stream/${bookId}/0`);
    audioElement.play();
    setAudio(audioElement);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700 opacity-30 blur-3xl rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center pt-12 pb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg text-center">Hear something amazing</h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">Enjoy performances of bestselling titles and new releases from authors and genres you love.</p>
      </div>

      {featured.length > 0 && (
        <section className="relative flex flex-col items-center justify-center py-6 mb-8 z-10">
          <div className="flex items-center justify-center gap-4">
            <button onClick={handlePrev} className="p-2 rounded-full bg-gray-800 bg-opacity-60 hover:bg-purple-700 transition shadow-lg">
              <FaChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-6">
              {featured.map((book, idx) => (
                <div
                  key={book._id}
                  className={`transition-all duration-500 ${idx === current ? 'scale-110 z-20' : 'scale-90 opacity-60 z-10'} relative flex flex-col items-center`}
                  style={{ minWidth: idx === current ? 240 : 160 }}
                >
                  <div className={`rounded-xl shadow-2xl ${idx === current ? 'ring-4 ring-purple-600' : ''} bg-gradient-to-br from-gray-800 to-gray-900 p-2`}>
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-40 h-56 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  {idx === current && (
                    <div className="mt-4 text-center">
                      <h2 className="text-2xl font-bold mb-1 text-white drop-shadow">{book.title}</h2>
                      <h3 className="text-md text-purple-400 mb-1">By {book.author}</h3>
                      <p className="text-sm text-gray-300 mb-2 max-w-xs mx-auto line-clamp-2">{book.description}</p>
                      <div className="flex flex-col items-center gap-2">
                        <Link
                          to={`/books/${book._id}`}
                          className="text-purple-200 hover:underline text-sm mb-1"
                        >
                          Personal Success
                        </Link>
                        <button
                          onClick={() => handleSamplePlay(book._id)}
                          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full shadow-lg transition"
                        >
                          <FaPlay /> Sample
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleNext} className="p-2 rounded-full bg-gray-800 bg-opacity-60 hover:bg-purple-700 transition shadow-lg">
              <FaChevronRight size={24} />
            </button>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
      {Object.keys(grouped).map((category) => (
        <div key={category} className="mb-10 px-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{category}</h2>
            {grouped[category].length > 4 && (
              <Link
                to={`/categories/${category}`}
                className="text-purple-400 hover:underline text-sm"
              >
                View All
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {grouped[category].slice(0, 4).map((book) => (
              <Link
                to={`/books/${book._id}`}
                key={book._id}
                className="relative group rounded-2xl p-2 bg-gray-800 bg-opacity-40 backdrop-blur-md hover:bg-opacity-60 transition duration-300 shadow-lg hover:shadow-purple-700 overflow-hidden"
              >
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="mt-3 px-1">
                  <h3 className="text-white text-lg font-semibold truncate">{book.title}</h3>
                  <p className="text-sm text-purple-300 truncate">{book.author}</p>
                </div>
              
                <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-purple-600 transition-all duration-300" />
              </Link>            
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default BooksList;
