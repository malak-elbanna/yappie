import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiUpload } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdCategory } from 'react-icons/md';
import BookCard from './BookCard';
import ImageUpload from './ImageUpload';

interface BookDetails {
  title: string;
  author: string;
  description: string;
  category: string;
  totaltime: string;
  narrator: string;
  publisher: string;
  cover_url: string;
  ratings: {
    average: number;
    total: number;
    story: number;
    narration: number;
  };
}

interface SimilarBook {
  _id: string;
  title: string;
  author: string;
  cover_url: string;
  ratings: {
    average: number;
  };
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [similarBooks, setSimilarBooks] = useState<SimilarBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch book details
        const bookResponse = await fetch(`http://localhost:5000/api/books/${id}`);
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch similar books (using random books endpoint for now)
        const similarResponse = await fetch('http://localhost:5000/api/random-books');
        const similarData = await similarResponse.json();
        setSimilarBooks(similarData.filter((b: SimilarBook) => b._id !== id));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUploadSuccess = (coverUrl: string) => {
    if (book) {
      setBook({ ...book, cover_url: coverUrl });
    }
    setShowUpload(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
  
  if (!book) return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-16 text-white">
      <h2 className="text-2xl font-bold">Book not found</h2>
      <Link to="/" className="mt-4 text-purple-500 hover:text-purple-400">
        Return to Home
      </Link>
    </div>
  );

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`text-lg sm:text-xl ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Cover */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <div className="relative group">
                <img
                  src={book.cover_url || '/default-book-cover.jpg'}
                  alt={book.title}
                  className="w-full rounded-lg shadow-2xl"
                />
                {!showUpload && (
                  <button
                    onClick={() => setShowUpload(true)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <FiUpload className="w-8 h-8 mr-2" />
                    Change Cover
                  </button>
                )}
              </div>
              
              {showUpload && (
                <div className="mt-4">
                  <ImageUpload
                    bookId={id || ''}
                    onUploadSuccess={handleUploadSuccess}
                  />
                  <button
                    onClick={() => setShowUpload(false)}
                    className="mt-2 text-sm text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-center">
                  Listen to sample
                </button>
                <button className="flex-1 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold text-center">
                  Subscribe now
                </button>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{book.title}</h1>
            <h2 className="text-xl text-gray-400 mb-4">By {book.author}</h2>

            {/* Ratings */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {renderStars(book.ratings.average)}
                <span className="text-gray-400">
                  (based on {book.ratings.total} ratings)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Story</p>
                  <div className="flex items-center">
                    {renderStars(book.ratings.story)}
                    <span className="ml-2">{book.ratings.story}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Narration</p>
                  <div className="flex items-center">
                    {renderStars(book.ratings.narration)}
                    <span className="ml-2">{book.ratings.narration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{book.description}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <BsPerson className="text-2xl text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Narrator</p>
                  <p className="break-words">{book.narrator}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="text-2xl text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p>{book.totaltime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IoDocumentTextOutline className="text-2xl text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Publisher</p>
                  <p className="break-words">{book.publisher}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdCategory className="text-2xl text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p>{book.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Others Listen To</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {similarBooks.map((book) => (
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
    </div>
  );
};

export default BookDetails; 