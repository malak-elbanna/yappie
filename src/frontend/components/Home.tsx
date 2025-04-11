import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';

interface Book {
  _id: string;
  title: string;
  author: string;
  cover_url: string;
  ratings: {
    average: number;
  };
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8080/books');
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Audiobooks</h1>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700">
                Popular
              </button>
              <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700">
                New Releases
              </button>
              <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700">
                Trending
              </button>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                id={book._id}
                title={book.title}
                author={book.author}
                cover_url={book.cover_url}
                rating={book.ratings.average}
              />
            ))}
          </div>

          {/* Load More Button */}
          {books.length > 0 && (
            <div className="flex justify-center py-8">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;