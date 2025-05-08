import React from 'react';

export const renderStars = (rating) => {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const StarRating = ({ rating }) => {
  return renderStars(rating);
};

export default StarRating;
