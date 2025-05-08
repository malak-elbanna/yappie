import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBooks } from '../Api'; // adjust path if needed


const CategoryBooks = () => {
  const { categoryName } = useParams();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredBooks = async () => {
      try {
        const allBooks = await getBooks();
        const booksInCategory = allBooks.filter(
          (book) => book.category?.toLowerCase() === categoryName.toLowerCase()
        );
        setFilteredBooks(booksInCategory);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredBooks();
  }, [categoryName]);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{categoryName} Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-gray-800 p-4 rounded">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-60 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{book.title}</h2>
              <p className="text-gray-400 mb-1">Author: {book.author}</p>
              <p className="text-gray-400">Rating: {book.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBooks;

