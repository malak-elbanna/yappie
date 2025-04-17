import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../Stream';

const BooksList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get('/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Books</h2>
      <ul>
        {books.map(book => (
          <li key={book._id} className="mb-2">
            <Link to={`/books/${book._id}`} className="text-blue-600 hover:underline">
              {book.title} — {book.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksList;
