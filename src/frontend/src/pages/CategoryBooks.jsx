import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../Stream';

const CategoryBooks = () => {
  const { categoryName } = useParams();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/books/');
        const booksInCategory = res.data.filter(
          (book) => book.category?.toLowerCase() === categoryName.toLowerCase()
        );
        setFilteredBooks(booksInCategory);
      } catch (err) {
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryName]);

  const getCategoryIcon = () => {
    const icons = {
      'philosophy': '🧠',
      'classics': '📖',
      'romance': '❤️',
      'religion': '🕊️',
      'adventure & historical fiction': '⏳',
      'travel & exploration': '🌍',
      'fables': '✍️',
      'children': '🚀',
      'comedy': '🎭',
      'drama': '🎬',
      'poetry': '📝',
      'fantasy': '🔮',
    };
    
    return icons[categoryName.toLowerCase()] || '📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="text-5xl mb-4">{getCategoryIcon()}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            {categoryName} Books
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Explore our collection of {categoryName.toLowerCase()} literature
          </p>
          
          <Link to="/categories" className="mt-4 text-purple-400 hover:text-purple-300 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Categories
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center text-gray-400 italic mt-20">
            No books found in this category. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link 
                to={`/books/${book._id}`} 
                key={book._id} 
                className="group relative bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-600 transition duration-300"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 line-clamp-1">{book.title}</h2>
                  <p className="text-gray-300 mb-1 text-sm">by {book.author}</p>
                  
                </div>
                
                <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-pink-600 transition-all duration-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBooks;

