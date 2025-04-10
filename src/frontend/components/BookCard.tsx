import React from 'react';
import { Link } from 'react-router-dom';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  rating: number;
}

const BookCard = ({ id, title, author, cover_url, rating }: BookCardProps) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`text-sm ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <Link to={`/books/${id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="aspect-w-2 aspect-h-3">
          <img
            src={cover_url || '/default-book-cover.jpg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <p className="text-gray-400 text-sm mb-2">{author}</p>
          <div className="flex items-center">
            {renderStars(rating)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard; 