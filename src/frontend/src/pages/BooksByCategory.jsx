import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BooksByCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/books?category=${category}`); // Backend endpoint
        const data = await response.json();
        console.log('Fetched books:', data); // Debugging log
        setBooks(data.books); // Assuming the API returns { books: [...] }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Books in Category: {category}</h1>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-bold">{book.title}</h2>
              <p className="text-sm text-gray-400">by {book.author}</p>
              <p className="text-sm text-gray-500">{book.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No books found in this category.</p>
      )}
    </div>
  );
};

export default BooksByCategory;