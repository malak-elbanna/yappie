import React from 'react';
import { renderStars } from '../utils/StarRating';

const ReviewSection = ({ reviews, newReview, setNewReview, handleSubmitReview }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Write a Review
        </h2>
        
        <form onSubmit={handleSubmitReview} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 font-medium">Rating</label>
            <div className="flex space-x-1">
              {[5, 4, 3, 2, 1].map(star => (
                <button
                  type="button"
                  key={star}
                  className="text-2xl focus:outline-none"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <span className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-500'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 font-medium">Your Thoughts</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full p-3 bg-gray-700 bg-opacity-50 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-40 focus:outline-none transition"
              rows="4"
              placeholder="Share your thoughts about this audiobook..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-pink-600/30 transition duration-300"
          >
            Submit Review
          </button>
        </form>
        
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          User Reviews
        </h2>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-400 italic py-6">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-700 bg-opacity-40 rounded-xl hover:bg-opacity-60 transition">
                {renderStars(review.rating)}
                <p className="mt-2 text-gray-300">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
