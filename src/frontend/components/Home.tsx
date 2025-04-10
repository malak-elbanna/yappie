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
        const response = await fetch('http://localhost:5000/api/list-books');
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Audiobooks</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
      </div>
    </div>
  );
};

export default Home; 